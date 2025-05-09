import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  username: string | null;
  role: string | null;
  onLogout: () => void;
}

const Header = ({ username, role,onLogout }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* 로고 + 검색창 */}
        <div className="header-left">
          <h1 className="logo">
            <Link to="/">📝 <span>LMS 플랫폼</span></Link>
          </h1>
        </div>

        {/* 상단 네비게이션 */}
        <div className="top-nav">
          {username ? (
            <>
              <span className="user-info">
                👤 <strong>{username}</strong>
                {role === 'ADMIN' && <span className="role">({role})</span>}
              </span>
              <Link to="/" onClick={onLogout}>로그아웃</Link>
              <Link to="/mypage">마이페이지</Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">로그인</Link>
              <Link className="nav-link" to="/register">회원가입</Link>
            </>
          )}
          <Link className="nav-link" to="/notices">공지사항</Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 