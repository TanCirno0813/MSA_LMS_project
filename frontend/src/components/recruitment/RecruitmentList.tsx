import { useEffect, useState } from 'react';
import { useSearchParams} from 'react-router-dom';
import axios from 'axios';
import './RecruitmentList.css';

interface Recruitment {
    recrutPblntSn: string;  // 공고번호
    recrutPbancTtl: string; // 채용공고제목
    instNm: string;         // 기관명
    recrutSe: string;       // 채용구분
    hireTypeLst: string;    // 고용유형목록
    srcUrl: string;      // 상세보기 URL
}

const MAX_PAGE = 20;  // 최대 페이지 수 제한

// 코드 변환 함수
const translateRecrutSe = (code: string): string => {
    switch (code) {
        case "R2010":
            return "신입";
        case "R2020":
            return "경력";
        case "R2030":
            return "신입+경력";
        case "R2040":
            return "외국인 전형";
        default:
            return "기타";
    }
};

const translateHireTypeLst = (code: string): string => {
    switch (code) {
        case "R1010":
            return "정규직";
        case "R1020":
            return "계약직";
        case "R1030":
            return "무기계약직";
        case "R1040":
            return "비정규직";
        case "R1050":
            return "청년인턴";
        case "R1060":
            return "청년인턴(체험형)";
        case "R1070":
            return "청년인턴(채용형)";
        default:
            return "기타";
    }
}

const RecruitmentList = () => {
    const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [totalItems, setTotalItems] = useState<number>(0);
    const ITEMS_PER_PAGE = 5;

    // URL 처리 함수 추가
    const formatUrl = (url: string): string => {
        if (url === 'N/A') return '#';
        if (url.startsWith('www.')) {
            return `https://${url}`;
        }
        return url;
    };

    // URL 쿼리 파라미터 관리
    const [searchParams, setSearchParams] = useSearchParams();
    const pageNo = parseInt(searchParams.get("pageNo") || "1", 10);
    const currentSearchKeyword = searchParams.get("searchKeyword") || '';

    // 페이지 변경 핸들러
    const changePage = (newPage: number) => {
        const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (newPage > 0 && newPage <= maxPage) {
            setSearchParams({ 
                pageNo: newPage.toString(),
                ...(currentSearchKeyword && { searchKeyword: currentSearchKeyword })
            });
        }
    };

    // 검색어 변경 핸들러
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams({ 
            pageNo: "1",
            ...(searchKeyword && { searchKeyword })
        });
    };

    // 채용 정보 가져오기
    const fetchRecruitments = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                pageNo: pageNo.toString()
            });
            if (currentSearchKeyword) {
                params.append('searchKeyword', currentSearchKeyword);
            }
            const response = await axios.get<{ items: Recruitment[], totalItems: number }>(`/api/recruitments?${params.toString()}`);
            setRecruitments(response.data.items);
            setTotalItems(response.data.totalItems);
            setError(null);
        } catch (err) {
            console.error("데이터 불러오기 실패:", err);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecruitments();
    }, [pageNo, currentSearchKeyword]);

    const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <>
            <div className="recruitment-list">
                <div className="recruitment-list__title">
                    📢 채용 공고 목록
                </div>
                <div className="recruitment-list__title-divider"></div>

                {/* 검색 폼 추가 */}
                <form onSubmit={handleSearch} className="recruitment-list__search">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="채용 공고 제목 검색..."
                        className="recruitment-list__search-input"
                    />
                    <button type="submit" className="recruitment-list__search-button">
                        검색
                    </button>
                </form>

                {error && <p className="recruitment-list__error">{error}</p>}

                <div className="recruitment-list__table-container">
                    <table className="recruitment-list__table">
                        <thead className="recruitment-list__thead">
                        <tr>
                            <th>공고 번호</th>
                            <th>채용 공고 제목</th>
                            <th>기관명</th>
                            <th>채용 구분</th>
                            <th>고용 유형</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="recruitment-list__loading">로딩 중...</td>
                            </tr>
                        ) : recruitments.length > 0 ? (
                            recruitments.map((item, index) => (
                                <tr key={`${item.recrutPblntSn}-${index}`}>
                                    <td>{item.recrutPblntSn}</td>
                                    <td>
                                        <a href={formatUrl(item.srcUrl)} target="_blank" rel="noopener noreferrer">
                                            {item.recrutPbancTtl}
                                        </a>
                                    </td>
                                    <td>{item.instNm}</td>
                                    <td>{translateRecrutSe(item.recrutSe)}</td>
                                    <td>{translateHireTypeLst(item.hireTypeLst)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="recruitment-list__no-data">채용 정보가 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="pagination-container">
                <div className="pagination">
                    <button 
                        onClick={() => changePage(pageNo - 1)} 
                        disabled={pageNo === 1}
                    >
                        이전
                    </button>
                    <span>페이지 {pageNo} / {maxPage}</span>
                    <button 
                        onClick={() => changePage(pageNo + 1)} 
                        disabled={pageNo >= maxPage}
                    >
                        다음
                    </button>
                </div>
            </div>
        </>
    );
};

export default RecruitmentList;
