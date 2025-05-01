import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lecture } from '../../utils/LectureDetailUtils';


interface ContentSectionProps {
    lecture: Lecture;
}

const ContentSection: React.FC<ContentSectionProps> = ({ lecture }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // localStorage에서 토큰 확인
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // auth-change 이벤트 리스너 추가
        const handleAuthChange = () => {
            const newToken = localStorage.getItem('token');
            setIsLoggedIn(!!newToken);
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const handleContentClick = (e: React.MouseEvent, isVideo: boolean, contentUrl?: string) => {
        if (!isLoggedIn) {
            e.preventDefault();
            alert("로그인한 사용자만 이용할 수 있습니다.")
            // 로그인 페이지로 리다이렉트
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        if (isVideo && contentUrl) {
            navigate(`/lectures/${lecture.id}/video/${contentUrl}`);
        } else {
            navigate(`/quiz/${lecture.id}`);
        }
    };

    return (
        <div className="content-section">
            <section id="contents">
                <h2 className="section-title">📚 강의 콘텐츠</h2>
                <ul className="content-list">
                    {lecture.contents.map((content) => (
                        <li key={content.id} className="content-item">
                            {content.type === 'video' ? (
                                <Link
                                    to={`/lectures/${lecture.id}/video/${content.url}`}
                                    className="content-link"
                                    onClick={(e) => handleContentClick(e, true, content.url)}
                                >
                                    <div className="video-icon">▶</div>
                                    <div>
                                        <strong className="content-title">{content.title}</strong>
                                        <p className="content-type">비디오</p>
                                    </div>
                                </Link>
                            ) : (
                                <button
                                    onClick={(e) => handleContentClick(e, false)}
                                    className="quiz-button"
                                >
                                    <div className="quiz-icon">📝</div>
                                    <div>
                                        <strong className="content-title">{content.title}</strong>
                                        <p className="content-type">퀴즈</p>
                                    </div>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default ContentSection;
