import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './NavBar.css';
import SearchBar from '../components/SearchBar';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: string) => {
    navigate(`/lectures?page=1&category=${encodeURIComponent(category)}`);
    setIsDropdownOpen(false);
  };

  const categoryCards = [
    {
      name: '신입사원',
    },
    {
      name: '사무 기획',
    },
    {
      name: '리더십/관리자',
    },
    {
      name: '자기개발',
    },
    {
      name: '디지털 시대',
    },
  ];

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#028267"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
            <span>전체메뉴</span>
          </div>

          <div 
            className="dropdown-container" 
            ref={dropdownRef}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link to="/lectures">
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
        {/* ✅ 경로가 /lectures 일 때는 검색창 숨기기 */}
        <div className="nav-right">
          {location.pathname !== '/lectures' && (
              <SearchBar className="nav-search" />
          )}
      </div>
      </div>
    </nav>
  );
};

export default NavBar; 