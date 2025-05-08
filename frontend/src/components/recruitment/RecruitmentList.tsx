import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecruitmentList.css';

interface Recruitment {
    wantedAuthNo: string;
    recrutPbancTtl: string;
    instNm: string;
    recrutSe: string;
    hireTypeLst: string;
    detailUrl: string;
}

const RecruitmentList = () => {
    const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const [filter, setFilter] = useState<string>('');

    const [searchParams, setSearchParams] = useSearchParams();
    useNavigate();
// 페이지 번호를 쿼리에서 가져오기 (기본값: 1)
    const page = parseInt(searchParams.get('page') || '1', 10);

    // 페이지 변경 핸들러
    const handlePageChange = (newPage: number) => {
        if (newPage > 0) {
            setSearchParams({ page: newPage.toString() });
        }
    };

    // 데이터 호출 함수
    const fetchRecruitments = async (pageNo: number, search: string, filter: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (pageNo > 1) params.append('pageNo', pageNo.toString());
            if (search) params.append('search', search);
            if (filter) params.append('filter', filter);

            const response = await axios.get<Recruitment[]>(`/api/recruitments?${params.toString()}`);
            setRecruitments(response.data);
        } catch {
            setError('데이터 불러오기 실패');
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경 감지하여 데이터 로드
    useEffect(() => {
        fetchRecruitments(page, search, filter);
    }, [page, search, filter]);

    return (
        <div className="recruitment-list">
            <h2 className="recruitment-list__title">채용 공고 목록 (페이지: {page})</h2>

            <div className="recruitment-list__controls">
                <input
                    type="text"
                    className="recruitment-list__search"
                    placeholder="제목 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="recruitment-list__filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="">전체</option>
                    <option value="R2010">신입</option>
                    <option value="R2020">경력</option>
                    <option value="R2030">신입+경력</option>
                </select>
            </div>

            {error && <p className="recruitment-list__error">{error}</p>}

            {/* 테이블 구조를 고정하고 데이터만 갱신 */}
            <table className="recruitment-list__table">
                <thead>
                <tr>
                    <th>공고 번호</th>
                    <th>채용 공고 제목</th>
                    <th>기관명</th>
                    <th>채용 구분</th>
                    <th>고용 유형</th>
                    <th>상세 URL</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6} className="recruitment-list__loading">
                            로딩 중...
                        </td>
                    </tr>
                ) : recruitments.length > 0 ? (
                    recruitments.map(item => (
                        <tr key={item.wantedAuthNo}>
                            <td>{item.wantedAuthNo}</td>
                            <td>{item.recrutPbancTtl}</td>
                            <td>{item.instNm}</td>
                            <td>{item.recrutSe}</td>
                            <td>{item.hireTypeLst}</td>
                            <td>
                                <a
                                    href={item.detailUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="recruitment-list__link"
                                >
                                    보기
                                </a>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="recruitment-list__no-data">
                            데이터가 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 페이징 버튼 */}
            <div className="recruitment-list__pagination">
                <button
                    className="recruitment-list__button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    이전
                </button>
                <span className="recruitment-list__page">페이지 {page}</span>
                <button
                    className="recruitment-list__button"
                    onClick={() => handlePageChange(page + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default RecruitmentList;
