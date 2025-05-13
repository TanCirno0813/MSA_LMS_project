import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import './LectureList.css';
import './LectureFilterBar.tsx';
import LectureFilterBar from "./LectureFilterBar.tsx";


interface Lecture {
    id: number;
    title: string;
    author: string;
    thumbnail: string;
    category: string;
    liked: boolean;
    likes: number;  // ✅ 추가
    description?: string; // 선택적으로 추가 가능
}



const ITEMS_PER_PAGE = 9;

const LectureList: React.FC = () => {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    // const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const keyword = searchParams.get('keyword') || '';

    // @ts-ignore
    const categoryFromURL = searchParams.get('category') || '전체';
    const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);

    const [selectedLevel] = useState('전체');





    const fetchLectures = async (page: number) => {
        setLoading(true);
        try {
            const res = await axios.get('/api/lectures', {
                params: {
                    page,
                    limit: ITEMS_PER_PAGE,
                    category: selectedCategory !== '전체' ? selectedCategory : undefined,
                    keyword: keyword.trim() !== '' ? keyword : undefined,
                },
            });
            setLectures(res.data.lectures);
            setTotalCount(res.data.totalCount);
        } catch (err) {
            console.error('강의 목록 불러오기 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLectures(currentPage);
    }, [currentPage, selectedCategory, selectedLevel, keyword]);

    const navigate = useNavigate();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // ✅ 좋아요 토글 처리 함수
    const handleToggleLike = async (lectureId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            const res = await axios.post(`/api/lectures/${lectureId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { liked, likes } = res.data;

            setLectures((prevLectures) =>
                prevLectures.map((lecture) =>
                    lecture.id === lectureId
                        ? { ...lecture, liked, likes }
                        : lecture
                )
            );
        } catch (err: any) {
            if (err.response?.status === 401) {
                alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error(`강의 ${lectureId} 좋아요 처리 실패:`, err);
                alert('좋아요 처리 중 오류가 발생했습니다.');
            }
        }
    };


    return (
        <>
            <LectureFilterBar
                selectedCategory={selectedCategory}
                keyword={keyword}
                onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    setSearchParams({ page: '1', category: cat }); // ✅ category 쿼리 적용
                }}
                onKeywordChange={(newKeyword) => {
                    setSearchParams({ page: '1', keyword: newKeyword });
                }}
                onSearch={() => {
                    setSearchParams({ page: '1', keyword });
                }}

            />

            <div className="lecture-page">
                <h2>강의 목록</h2>
                {loading ? <p>로딩 중...</p> : (
                    <>
                        <div className="lecture-grid">
                            {lectures.map((lecture) => (
                                <div
                                    key={lecture.id}
                                    className="lecture-card"
                                    onClick={() => navigate(`/lectures/${lecture.id}`)}
                                >
                                    <img src={lecture.thumbnail} alt="썸네일" className="lecture-thumbnail" />
                                    <div className="lecture-info">
                                        <h3>{lecture.title}</h3>
                                        <div className="lecture-meta">
                                            <div
                                                className="like-container"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleLike(lecture.id);
                                                }}
                                            >
                                                <span className={`like-icon ${lecture.liked ? 'liked' : ''}`}>❤️</span>
                                                <span className="like-count">{lecture.likes}</span>
                                            </div>
                                            <span className="lecture-category">{lecture.category || '공통'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pagination-list">
                            {[...Array(totalPages)].map((_, idx) => {
                                const page = idx + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setSearchParams({ page: page.toString() })}
                                        className={page === currentPage ? 'active' : ''}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default LectureList;
