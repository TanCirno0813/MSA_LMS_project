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
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!lectureId) return;

        axios.get(`/api/lectures/${lectureId}`)
            .then(res => {
                const allContents: Content[] = res.data.contents;
                const videoContents = allContents.filter(c => c.type === 'video');
                setContents(videoContents);
                const index = videoContents.findIndex(c => c.url === videoId);
                setCurrentIndex(index);
                
                // 현재 비디오 콘텐츠 설정
                if (index !== -1) {
                    setCurrentContent(videoContents[index]);
                }
            })
            .catch(err => console.error('콘텐츠 로딩 실패:', err));
    }, [lectureId, videoId]);

    useEffect(() => {
        const interval = setInterval(() => {
            const iframe = iframeRef.current;
            if (!iframe) return;
            const playerWindow = iframe.contentWindow;
            if (playerWindow) {
                playerWindow.postMessage('{"event":"listening","id":1}', '*');
            }
        }, 1000);

        window.addEventListener("message", handleMessage);
        return () => {
            clearInterval(interval);
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const handleMessage = (event: MessageEvent) => {
        if (typeof event.data === "string" && event.data.includes("infoDelivery")) {
            try {
                const data = JSON.parse(event.data);
                if (data.info && data.info.playerState === 0) {
                    setShowNextButton(true);
                }
            } catch { }
        }
    };

    // 🔥 YouTube API 통해 영상 길이 가져와 자동 이수 등록
    useEffect(() => {
        const loadYouTubeAPI = () => {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        };

        // const onPlayerReady = (event: any) => {
        //     const duration = event.target.getDuration(); // 영상 총 길이 (초)
        //     const buffer = 5; // 안전 여유시간 (초)
        //     const totalWait = (duration + buffer) * 1000; // ms 단위로 변환
        //
        //     timeoutRef.current = setTimeout(() => {
        //         const accessToken = localStorage.getItem("accessToken"); // accessToken 가져오기
        //         if (accessToken && lectureId) {
        //             axios.post("/api/completions", {
        //                 lectureId: Number(lectureId),
        //                 watchedTime: Math.floor(duration),  // 전체 시간을 watchedTime으로 보내기
        //                 totalDuration: Math.floor(duration) // 전체 시간을 totalDuration으로 보내기
        //             }, {
        //                 headers: {
        //                     Authorization: `Bearer ${accessToken}`
        //                 }
        //             })
        //                 .then(() => {
        //                     console.log("✅ 자동 이수 등록 완료");
        //                 })
        //                 .catch(err => {
        //                     console.error("❌ 자동 이수 등록 실패:", err);
        //                 });
        //         }
        //     }, totalWait);
        // };

        const onPlayerReady = (event: any) => {
            playerRef.current = event.target;
            const totalWait = 5 * 1000;

            timeoutRef.current = setTimeout(() => {
                registerCompletion(currentContent);
            }, totalWait);
        };

        window.onYouTubeIframeAPIReady = () => {
            new window.YT.Player("ytplayer", {
                events: { onReady: onPlayerReady },
            });
        };

        if (!window.YT) loadYouTubeAPI();
        else window.onYouTubeIframeAPIReady();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [lectureId, videoId, currentContent]);

    // 이수 등록 함수 분리
    const registerCompletion = (content: Content | null) => {
        const accessToken = localStorage.getItem("token");
        console.log("🔥 이수 등록 시도 중...", { accessToken, lectureId, contentTitle: content?.title });

        if (accessToken && lectureId && content) {
            axios.post("/api/completions", {
                lectureId: Number(lectureId),
                watchedTime: 5,
                totalDuration: 5,
                contentTitle: content.title // 콘텐츠 제목 추가
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(() => {
                    console.log("✅ 자동 이수 등록 완료:", content.title);
                })
                .catch(err => {
                    console.error("❌ 자동 이수 등록 실패:", err);
                });
        } else {
            console.warn("⚠️ accessToken, lectureId 또는 currentContent 누락됨");
        }
    };

    const handleNext = () => {
        const nextContent = contents[currentIndex + 1];
        if (nextContent) {
            setShowNextButton(false);
            
            // 다음 영상으로 이동 전에 현재 영상의 이수 등록 확인
            if (currentContent) {
                registerCompletion(currentContent);
            }
            
            // URL 생성 및 페이지 새로고침
            const nextUrl = `/lectures/${lectureId}/video/${nextContent.url}`;
            setTimeout(() => {
                // window.location.href를 사용해 전체 페이지 새로고침
                window.location.href = nextUrl;
            }, 500);
        } else {
            alert("모든 영상을 시청했습니다. 확인 문제로 이동합니다.");
            window.location.href = `/quiz/${lectureId}`;
        }
    };

    return (
        <div style={{ padding: '20px', width: '50%', margin: '0 auto' }}>
            <h2>📺 강의 영상 {currentContent ? `- ${currentContent.title}` : ''}</h2>
            <iframe
                ref={iframeRef}
                id="ytplayer" // 🎯 반드시 필요!
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
