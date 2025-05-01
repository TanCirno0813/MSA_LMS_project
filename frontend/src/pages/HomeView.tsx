import { useState, useEffect, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import './HomeView.css';


import axios from '../api/axios'; // 경로는 프로젝트 구조에 맞게
import {Link, useNavigate} from 'react-router-dom';
import {Box, Button} from "@mui/material";


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

const HomeView = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

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
  }, []);


  const navigate = useNavigate();
  const handleCategoryClick = (category: string) => {
    navigate(`/lectures?page=1&category=${encodeURIComponent(category)}`);
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

        <section className="home-notice-preview" style={{padding: '20px 40px'}}>
          <h2 style={{marginBottom: '10px'}}>📢 공지사항</h2>
          <ul style={{listStyle: 'none', padding: 0}}>
            {notices.map(notice => (
                <li key={notice.id} style={{marginBottom: '6px'}}>
                  <Link to={`/notices/${notice.id}`} style={{textDecoration: 'none', color: '#333'}}>
                    {notice.title} <span style={{fontSize: '0.8rem', color: '#888'}}>
            ({new Date(notice.createdAt).toLocaleDateString()})
          </span>
                  </Link>
                </li>
            ))}
          </ul>
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button
                size="small"
                component={Link}
                to="/notices"
                variant="text"
                sx={{textTransform: 'none'}}
            >
              더보기 →
            </Button>
          </Box>
        </section>

      </div>

  );
};

export default HomeView; 