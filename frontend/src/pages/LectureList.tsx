import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import './LectureList.css';
import './LectureFilterBar';
import LectureFilterBar from "./LectureFilterBar.tsx";


interface Lecture {
    id: number;
    title: string;
    author: string;
    thumbnail: string;
    category: string;
    level: string;
    likes: number;
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

    // const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedLevel, setSelectedLevel] = useState('전체');





    const fetchLectures = async (page: number) => {
        setLoading(true);
        try {
            const res = await axios.get('/api/lectures', {
                params: {
                    page,
                    limit: ITEMS_PER_PAGE,
                    category: selectedCategory !== '전체' ? selectedCategory : undefined,
                    level: selectedLevel !== '전체' ? selectedLevel : undefined,
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

    return (
        <>
            <LectureFilterBar
                selectedCategory={selectedCategory}
                selectedLevel={selectedLevel}
                keyword={keyword}
                onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    setSearchParams({ page: '1', category: cat }); // ✅ category 쿼리 적용
                }}
                onLevelChange={(lvl) => {
                    setSelectedLevel(lvl);
                    setSearchParams({ page: '1' });
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
                                <div key={lecture.id} className="lecture-card"    onClick={() => navigate(`/lectures/${lecture.id}`)}>
                                    <img src={lecture.thumbnail} alt="썸네일" className="lecture-thumbnail" />
                                    <div className="lecture-info">
                                        <h3>{lecture.title}</h3>
                                        <p className="lecture-meta">
                                            ❤️ {lecture.likes ?? 0} &nbsp; | &nbsp;
                                            {lecture.category || '공통'} | {lecture.level || '초급'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pagination">
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
