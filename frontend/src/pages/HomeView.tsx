import { useState, useEffect, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import './HomeView.css';


import axios from '../api/axios'; // 경로는 프로젝트 구조에 맞게
import {Link, useNavigate} from 'react-router-dom';
import { Typography} from "@mui/material";
import { Forum } from '@mui/icons-material';


interface BannerSlide {
  image: string;
  // title?: string;
  // description?: string;
}
const bannerSlides: BannerSlide[] = [
  {
    image: '/images/323.png',
    // title: '기업 맞춤형 교육 플랫폼',
    // description: '직원들의 역량 강화와 법정의무교육을 한 곳에서 관리하세요.'
  },
  {
    image: '/images/876.png',
    // title: '응급처치 및 안전교육',
    // description: '현장에서 활용 가능한 실무 중심의 안전 및 응급처치 교육을 제공합니다.'
  },
  {
    image: '/images/456.png',
    // title: '직무역량 강화 프로그램',
    // description: '직무별 맞춤형 교육으로 임직원의 업무 역량을 향상시키세요.'
  }
];

const categoryCards = [
  {
    name: '신입사원',
    emoji: '👶',
    description: '첫 출발을 위한 필수 강의! 직장생활 A to Z',
  },
  {
    name: '사무 기획',
    emoji: '🗂️',
    description: '기획력과 문서작성 능력을 한 단계 업그레이드!',
  },
  {
    name: '리더십/관리자',
    emoji: '👔',
    description: '팀을 이끄는 리더를 위한 전략적 역량 개발',
  },
  {
    name: '자기개발',
    emoji: '🌱',
    description: '나를 성장시키는 셀프 브랜딩부터 시간관리까지',
  },
  {
    name: '디지털 시대',
    emoji: '💻',
    description: 'AI, 빅데이터, 디지털 툴로 앞서가는 업무역량 완성!',
  },
];

interface Review {
  id: number;
  title: string;
  author: string;
  content: string;
  lectureTitle: string;
  createdAt: string;
}

const HomeView = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  useEffect(() => {
    const swiper = new Swiper('.bannerSwiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      slideToClickedSlide: true,
    });

    return () => {
      swiper.destroy(true, true);
    };
  }, []);


  interface Notice {
    id: number;
    title: string;
    createdAt: string;
  }

  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    axios.get('/notices').then(res => {
      setNotices(res.data.slice(0, 5)); // 최근 5개만
    });
    
    // 최근 리뷰 가져오기
    axios.get('/reviews').then(res => {
      // 최근 리뷰 3개만 표시
      setRecentReviews(res.data.slice(0, 3));
    }).catch(err => {
      console.error('리뷰 로딩 오류:', err);
    });
  }, []);


  const navigate = useNavigate();
  const handleCategoryClick = (category: string) => {
    navigate(`/lectures?page=1&category=${encodeURIComponent(category)}`);
  };

  // 프로필 이미지 색상 생성 함수
  const getProfileColor = (name: string) => {
    const colors = ['#028267', '#5e35b1', '#d81b60', '#039be5', '#fb8c00', '#546e7a'];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };


  return (
      <div className="home" style={{marginTop:'1%'}}>
        {/* 배너 영역 */}
        <section id="main-banner">
          <div className="banner-container">
            <div className="swiper bannerSwiper" ref={bannerRef}>
              <div className="swiper-wrapper">
                {bannerSlides.map((slide, index) => (
                    <div className="swiper-slide" key={index}>
                      <img src={slide.image} alt={`slide-${index}`} className="banner-image" />
                    </div>
                ))}
              </div>
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </section>
        {/* 카테고리 버튼 영역 */}
        <section className="category-section">
          <div className="category-container">
            <h2 className="section-title">카테고리별 강의</h2>
            <div className="category-card-grid">
              {categoryCards.map((cat) => (
                  <div
                      key={cat.name}
                      className="category-card"
                      onClick={() => handleCategoryClick(cat.name)}
                  >
                    <div className="category-title">{cat.emoji} {cat.name}</div>
                    <p className="category-description">{cat.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>
        {/* 기업 교육 정보 섹션 */}
        <section className="corporate-info-section">
          <div className="container" style={{padding: '40px 20px'}}>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">🔔</div>
                <h3>법정의무교육</h3>
                <p>성희롱 예방, 개인정보보호, 산업안전 등 법정의무교육을 체계적으로 관리하세요.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🧠</div>
                <h3>직무역량 강화</h3>
                <p>직무별 맞춤형 교육과정으로 임직원의 업무 역량을 향상시킵니다.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📊</div>
                <h3>교육 현황 분석</h3>
                <p>부서별, 직급별 교육 이수 현황을 한눈에 파악하고 관리할 수 있습니다.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📱</div>
                <h3>모바일 학습</h3>
                <p>언제 어디서나 모바일로 편리하게 학습할 수 있는 환경을 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 공지사항 섹션 */}
        <section className="home-notice-preview">
          <div>
          <h2>📢 공지사항</h2>
          <ul className="notice-list">
            {notices.map(notice => (
                <li key={notice.id} className="notice-item">
                  <Link to={`/notices/${notice.id}`} className="notice-link">
                    <span className="notice-title">{notice.title}</span>
                    <span className="notice-date">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
            ))}
          </ul>
          <div>
            <Link to="/notices" className="more-button">
              더보기 →
            </Link>
          </div>
          </div>
        </section>

        {/* 최근 리뷰 섹션 */}
        <section className="home-reviews-preview">
          <div className="home-reviews-header">
            <h2 className="home-reviews-title">💬 최근 리뷰</h2>
            <Link to="/reviews" className="reviews-button">
              모든 리뷰 보기
            </Link>
          </div>
          
          {recentReviews.length === 0 ? (
            <div className="empty-reviews">
              <Forum className="empty-icon" />
              <Typography variant="h6">아직 등록된 리뷰가 없습니다.</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                첫 번째 리뷰를 작성해보세요. 강의를 수강한 후 리뷰를 남겨주시면 다른 수강생들에게 도움이 됩니다.
              </Typography>
            </div>
          ) : (
            <div className="reviews-grid">
              {recentReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-content">
                    <div className="review-header">
                      <div 
                        className="review-avatar"
                        style={{ backgroundColor: getProfileColor(review.author) }}
                      >
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="review-info">
                        <div className="review-title">{review.title}</div>
                        <div className="review-meta">
                          {review.author} • {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <hr className="review-divider" />
                    
                    <div className="lecture-chip">
                      {review.lectureTitle}
                    </div>
                    
                    <div className="review-text">
                      {review.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

  );
};

export default HomeView; 