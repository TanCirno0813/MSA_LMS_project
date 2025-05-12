import {Link, useLocation} from 'react-router-dom';
import './NavBar.css';
import SearchBar from '../components/SearchBar';

const NavBar = () => {
  const location = useLocation(); // ✅ 현재 경로 추적
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

          <Link to="/lectures">강의 목록</Link>
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