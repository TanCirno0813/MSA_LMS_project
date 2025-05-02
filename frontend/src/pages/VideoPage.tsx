import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const playerRef = useRef<any>(null);
    const resumeTimeRef = useRef<number>(0);

    const username = localStorage.getItem("username");

    useEffect(() => {
        if (!lectureId) return;

        axios.get(`/api/lectures/${lectureId}`)
            .then(res => {
                const allContents: Content[] = res.data.contents;
                const videoContents = allContents.filter(c => c.type === 'video');
                setContents(videoContents);
                const index = videoContents.findIndex(c => c.url === videoId);
                setCurrentIndex(index);
                if (index !== -1) {
                    setCurrentContent(videoContents[index]);
                }
            })
            .catch(err => console.error('콘텐츠 로딩 실패:', err));
    }, [lectureId, videoId]);

    useEffect(() => {
        const loadYouTubeAPI = () => {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        };

        const createPlayer = () => {
            if (playerRef.current) playerRef.current.destroy();

            playerRef.current = new window.YT.Player("ytplayer", {
                events: {
                    onReady: (event: any) => {
                        console.log("🎬 플레이어 준비 완료");
                        if (resumeTimeRef.current > 0) {
                            event.target.seekTo(resumeTimeRef.current, true);
                        }
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
    }, [videoId, currentContent]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (playerRef.current && currentContent && lectureId && username) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();

                if (duration > 0) {
                    const accessToken = localStorage.getItem("token");
                    localStorage.setItem(`resume_${username}_${lectureId}_${currentContent.title}`, currentTime.toString());

                    axios.post("/api/completions", {
                        lectureId: Number(lectureId),
                        watchedTime: Math.floor(currentTime),
                        totalDuration: Math.floor(duration),
                        contentTitle: currentContent.title
                    }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }).then(() => {
                        console.log(`📤 진행률 전송: ${currentContent.title} - ${Math.floor((currentTime / duration) * 100)}%`);
                    }).catch(err => {
                        console.error("❌ 진행률 저장 실패:", err);
                    });
                }
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [lectureId, currentContent, username]);

    useEffect(() => {
        if (lectureId && currentContent && username) {
            const saved = localStorage.getItem(`resume_${username}_${lectureId}_${currentContent.title}`);
            if (saved) {
                resumeTimeRef.current = parseFloat(saved);
            }
        }
    }, [lectureId, currentContent, username]);

    const registerCompletion = (content: Content | null, duration: number) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken && lectureId && content) {
            axios.post("/api/completions", {
                lectureId: Number(lectureId),
                watchedTime: Math.floor(duration),
                totalDuration: Math.floor(duration),
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

            const nextUrl = `/lectures/${lectureId}/video/${nextContent.url}`;
            setTimeout(() => {
                window.location.href = nextUrl;
            }, 500);
        } else {
            alert("모든 영상을 시청했습니다. 확인 문제로 이동합니다.");
            window.location.href = `/quiz/${lectureId}`;
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>📺 강의 영상 {currentContent ? `- ${currentContent.title}` : ''}</h2>
            <iframe
                ref={iframeRef}
                id="ytplayer"
                width="100%"
                height="600"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                title="강의 영상"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>

            <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', fontSize: '16px' }}>
                    ⬅ 뒤로가기
                </button>
                {showNextButton && (
                    <button
                        onClick={handleNext}
                        style={{ marginLeft: '10px', padding: '8px 16px', fontSize: '16px' }}
                    >
                        ▶ 다음 영상 보기
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoPage;