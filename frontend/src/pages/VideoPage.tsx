import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VideoPage.css';


interface Content {
    id: number;
    title: string;
    type: string;
    url: string;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

const VideoPage: React.FC = () => {
    const { lectureId, videoId } = useParams<{ lectureId: string; videoId: string }>();
    const navigate = useNavigate();

    const [contents, setContents] = useState<Content[]>([]);
    const [currentContent, setCurrentContent] = useState<Content | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [shouldResume, setShouldResume] = useState(false);
    const playerRef = useRef<any>(null);
    const resumeTimeRef = useRef<number>(0);
    const username = localStorage.getItem("username");

    useEffect(() => {
        if (!lectureId) return;

        axios.get(`/api/lectures/${lectureId}`)
            .then(res => {
                const videoContents: Content[] = res.data.contents.filter((c: Content) => c.type === 'video');
                setContents(videoContents);
                const index = videoContents.findIndex((c: Content) => c.url === videoId);
                setCurrentIndex(index);
                if (index !== -1) setCurrentContent(videoContents[index]);
            })
            .catch(err => console.error('콘텐츠 로딩 실패:', err));
    }, [lectureId, videoId]);

    useEffect(() => {
        const fetchResumeTime = async () => {
            const accessToken = localStorage.getItem("token");
            if (!lectureId || !currentContent || !accessToken) return;

            try {
                const res = await axios.get("/api/completions/resume", {
                    params: {
                        lectureId: Number(lectureId),
                        contentTitle: currentContent.title
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (res.data?.resumeTime > 5) {
                    resumeTimeRef.current = res.data.resumeTime;
                    setShowResumeDialog(true);
                }
            } catch (err) {
                console.log("📭 이어보기 기록 없음");
            }
        };

        fetchResumeTime();
    }, [lectureId, currentContent]);

    useEffect(() => {
        const loadYouTubeAPI = () => {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        };

        const createPlayer = () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            playerRef.current = new window.YT.Player("ytplayer", {
                videoId: videoId,
                events: {
                    onReady: (event: any) => {
                        setIsPlayerReady(true);
                        if (!showResumeDialog) event.target.seekTo(0, true);
                        if (shouldResume) event.target.seekTo(resumeTimeRef.current, true);
                    },
                    onStateChange: (event: any) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            setShowNextButton(true);
                            if (playerRef.current && currentContent?.title) {
                                const duration = playerRef.current.getDuration();
                                registerCompletion(currentContent, duration + 1);
                            }
                        }
                    }
                }
            });
        };

        if (!window.YT || !window.YT.Player) {
            window.onYouTubeIframeAPIReady = createPlayer;
            loadYouTubeAPI();
        } else {
            createPlayer();
        }

        return () => {
            if (playerRef.current) playerRef.current.destroy();
        };
    }, [videoId, currentContent, showResumeDialog, shouldResume]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (
                playerRef.current &&
                typeof playerRef.current.getCurrentTime === 'function' &&
                currentContent && lectureId && username
            ) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                if (duration > 0) {
                    const accessToken = localStorage.getItem("token");

                    axios.post("/api/completions", {
                        lectureId: Number(lectureId),
                        watchedTime: Math.floor(currentTime),
                        totalDuration: Math.floor(duration),
                        resumeTime: Math.floor(currentTime),
                        contentTitle: currentContent.title
                    }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }).then(() => {
                        console.log(`📤 진행률 전송: ${Math.floor((currentTime / duration) * 100)}%`);
                    }).catch(err => console.error("❌ 진행률 저장 실패:", err));
                }
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [lectureId, currentContent, username]);

    const registerCompletion = (content: Content | null, duration: number) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken && lectureId && content) {
            axios.post("/api/completions", {
                lectureId: Number(lectureId),
                watchedTime: Math.floor(duration),
                totalDuration: Math.floor(duration),
                resumeTime: Math.floor(duration),
                contentTitle: content.title
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(() => {
                console.log("✅ 자동 이수 등록 완료:", content.title);
            }).catch(err => {
                console.error("❌ 자동 이수 등록 실패:", err);
            });
        }
    };

    const handleNext = () => {
        const nextContent = contents[currentIndex + 1];
        if (nextContent) {
            setShowNextButton(false);
            if (currentContent && playerRef.current) {
                const duration = playerRef.current.getDuration();
                registerCompletion(currentContent, duration + 1);
            }
            navigate(`/lectures/${lectureId}/video/${nextContent.url}`);
        } else {
            alert("모든 영상을 시청했습니다. 확인 문제로 이동합니다.");
            navigate(`/quiz/${lectureId}`);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>📺 강의 영상 {currentContent ? `- ${currentContent.title}` : ''}</h2>

            <div id="ytplayer" className="youtube-player"></div>

            {showResumeDialog && isPlayerReady && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{background: '#fff', padding: 30, borderRadius: 10, textAlign: 'center'}}>
                        <h3>이어보기를 하시겠습니까?</h3>
                        <p>
                            {Math.floor(resumeTimeRef.current / 60)}분 {resumeTimeRef.current % 60}초부터 이어볼 수 있습니다.
                        </p>
                        <button
                            onClick={() => {
                                setShouldResume(true);
                                setShowResumeDialog(false);
                            }}
                            className="resume-dialog-button"
                        >
                            이어보기
                        </button>

                        <button
                            onClick={() => {
                                setShouldResume(false);
                                setShowResumeDialog(false);
                            }}
                            className="resume-dialog-button"
                        >
                            처음부터
                        </button>

                    </div>
                </div>
            )}

            <div className="video-button-group">
            <button onClick={() => navigate(-1)} className="video-button">
                    ⬅ 뒤로가기
                </button>
                {showNextButton && (
                    <button onClick={handleNext} className="video-button">
                        ▶ 다음 영상 보기
                    </button>
                )}
            </div>

        </div>
    );
};

export default VideoPage;