import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, useSearchParams} from 'react-router-dom';
import axios from 'axios';
import './RecruitmentList.css';

interface Recruitment {
    recrutPblntSn: string;  // 공고번호
    recrutPbancTtl: string; // 채용공고제목
    instNm: string;         // 기관명
    recrutSe: string;       // 채용구분
    hireTypeLst: string;    // 고용유형목록
    detailUrl: string;      // 상세보기 URL
}

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

    // URL 쿼리 파라미터 관리
    const [searchParams, setSearchParams] = useSearchParams();
    const pageNo = parseInt(searchParams.get("pageNo") || "1", 10);

    // 페이지 변경 핸들러
    const changePage = (newPage: number) => {
        if (newPage > 0) {
            setSearchParams({ pageNo: newPage.toString() });
        }
    };

    // 채용 정보 가져오기
    const fetchRecruitments = async () => {
        try {
            setLoading(true);
            const response = await axios.get<Recruitment[]>(`/api/recruitments?pageNo=${pageNo}`);
            setRecruitments(response.data);
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
    }, [pageNo]);

    return (
        <div className="recruitment-list">
            <h2 className="recruitment-list__title">채용 공고 목록</h2>
            {error && <p className="recruitment-list__error">{error}</p>}

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
                        <td colSpan={6} className="recruitment-list__loading">로딩 중...</td>
                    </tr>
                ) : recruitments.length > 0 ? (
                    recruitments.map((item, index) => (
                        <tr key={`${item.recrutPblntSn}-${index}`}>
                            <td>{item.recrutPblntSn}</td>
                            <td>{item.recrutPbancTtl}</td>
                            <td>{item.instNm}</td>
                            <td>{translateRecrutSe(item.recrutSe)}</td>
                            <td>{translateHireTypeLst(item.hireTypeLst)}</td>
                            <td>
                                <a href={item.detailUrl} target="_blank" rel="noopener noreferrer">보기</a>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="recruitment-list__no-data">채용 정보가 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => changePage(pageNo - 1)} disabled={pageNo === 1}>이전</button>
                <span>페이지 {pageNo}</span>
                <button onClick={() => changePage(pageNo + 1)}>다음</button>
            </div>
        </div>
    );
};

export default RecruitmentList;
