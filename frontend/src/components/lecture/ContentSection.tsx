import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lecture } from '../../utils/LectureDetailUtils';
import './ContentSection.css';

interface ContentSectionProps {
    lecture: Lecture;
    setCompletionRate: (rate: number) => void;
}

interface CompletionData {
    contentTitle: string;
    watchedTime: number;
    totalDuration: number;
}

const ContentSection: React.FC<ContentSectionProps> = ({ lecture, setCompletionRate }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [completionMap, setCompletionMap] = useState<Record<string, CompletionData>>({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (token) {
            fetch('/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((userData) => {
                    setCurrentUser(userData.id);
                })
                .catch((err) => {
                    console.error('사용자 정보 불러오기 실패:', err);
                });

            fetch('/api/completions/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const map: Record<string, CompletionData> = {};
                    data.forEach((item: any) => {
                        if (item.lectureId === lecture.id) {
                            map[item.contentTitle] = {
                                contentTitle: item.contentTitle,
                                watchedTime: item.watchedTime || 0,
                                totalDuration: item.totalDuration || 1, // 최소 1로 나눗셈 방지
                            };
                        }
                    });
                    setCompletionMap(map);
                })
                .catch((err) => {
                    console.error('이수 이력 불러오기 실패:', err);
                });
        }

        const handleAuthChange = () => {
            const newToken = localStorage.getItem('token');
            setIsLoggedIn(!!newToken);
        };

        const totalContents = lecture.contents.length;
        let completedCount = 0;


        lecture.contents.forEach((content) => {
            let progress = 0;

            if (content.type === 'video') {
                progress = calculateProgress(content.title);
            } else if (content.type === 'quiz') {
                const isQuizCompleted = localStorage.getItem(`quizCompleted_${lecture.id}_${currentUser}`) === 'true';
                progress = isQuizCompleted ? 100 : 0;
            }

            if (progress >= 100) completedCount += 1;
        });

        const rate = Math.round((completedCount / totalContents) * 100);
        setCompletionRate(rate);

        window.addEventListener('auth-change', handleAuthChange);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key && e.key.startsWith('quizCompleted_')) {
                // 강제로 상태 갱신 (setCompletionMap 등)
                setCompletionMap((prev) => ({ ...prev }));
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, [lecture.id, completionMap, lecture.contents, currentUser]);

    const handleContentClick = (e: React.MouseEvent, isVideo: boolean, contentUrl?: string) => {
        if (!isLoggedIn) {
            e.preventDefault();
            alert("로그인한 사용자만 이용할 수 있습니다.");
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        if (isVideo && contentUrl) {
            navigate(`/lectures/${lecture.id}/video/${contentUrl}`);
        } else {
            navigate(`/quiz/${lecture.id}`);
        }
    };

    const calculateProgress = (contentTitle: string) => {
        const completion = completionMap[contentTitle];
        if (!completion) return 0;

        const { watchedTime, totalDuration } = completion;
        const rawProgress = (watchedTime / totalDuration) * 100;
        return Math.min(100, Math.round(rawProgress)); // ✅ floor → round, 100% 보정
    };

    return (
        <div className="content-section">
            <section id="contents">
                <h2 className="section-title">📚 강의 콘텐츠</h2>
                <ul className="content-list">
                    {lecture.contents.map((content) => {
                        const progress = content.type === 'video'
                            ? calculateProgress(content.title)
                            : null;

                        return (
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
                                            <div className="video-progress-bar-wrapper">
                                                <div className="video-progress-bar-bg">
                                                    <div
                                                        className="video-progress-bar-fill"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="video-progress-label">{progress}% 완료</span>
                                            </div>
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
                        );
                    })}
                </ul>
            </section>
        </div>
    );
};

export default ContentSection;