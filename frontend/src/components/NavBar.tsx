import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './NavBar.css';
import SearchBar from '../components/SearchBar';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // ✅ 상태 추가

  // ✅ 카테고리 클릭 핸들러
  const handleCategoryClick = (category: string) => {
    // URL 파라미터 설정
    const newUrl = `/lectures?page=1&category=${encodeURIComponent(category)}`;

    // 현재 경로와 같아도 강제로 새로고침
    if (location.pathname + location.search === newUrl) {
      window.location.href = newUrl; // 강제 URL 이동
    } else {
      navigate(newUrl);
      setTimeout(() => {
        window.location.reload(); // 강제 새로고침
      });
    }

    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  const handleLectureListClick = () => {
    // 메인 강의 목록 클릭 시
    // navigate('/lectures?page=1');

    // 페이지 이동 후 강제 새로고침
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  const categoryCards = [
    { name: '신입사원' },
    { name: '사무 기획' },
    { name: '리더십/관리자' },
    { name: '자기개발' },
    { name: '디지털 시대' },
  ];

  // ✅ URL 변화 감지하여 상태 업데이트
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || '';
    setSelectedCategory(category); // URL이 바뀔 때 상태 갱신
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-left">
            <div className="menu-icon">
              <span>전체메뉴</span>
            </div>

            <div
                className="dropdown-container"
                ref={dropdownRef}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link to="/lectures" onClick={handleLectureListClick}>
                강의 목록
              </Link>
              {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {categoryCards.map((category) => (
                        <Link
                            key={category.name}
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryClick(category.name);
                            }}
                            className={selectedCategory === category.name ? 'active' : ''} // ✅ 선택 시 강조
                        >
                          {category.name}
                        </Link>
                    ))}
                  </div>
              )}
            </div>
            <Link to="/reviews">리뷰 목록</Link>
            <Link to="/recruitment">공고 목록</Link>
          </div>
          <div className="nav-right">
            {location.pathname !== '/lectures' && <SearchBar className="nav-search" />}
          </div>
        </div>
      </nav>
  );
};

export default NavBar;
