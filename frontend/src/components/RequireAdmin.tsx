import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (token && role === 'ADMIN') {
        setIsAdmin(true);
      }
      
      setLoading(false);
    };
    
    checkAdmin();
  }, []);

  if (loading) {
    // 로딩 중일 때는 아무것도 렌더링하지 않음
    return <div>권한을 확인하는 중...</div>;
  }

  if (!isAdmin) {
    // 관리자가 아닐 경우 메인 페이지로 리다이렉트
    return (
      <>
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0,
          bottom: 0, 
          backgroundColor: 'white', 
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <h1 style={{ color: 'red', marginBottom: '20px' }}>접근 권한이 없습니다</h1>
          <p>관리자만 접근할 수 있는 페이지입니다.</p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            메인 페이지로 이동
          </button>
        </div>
        <Navigate to="/" replace />
      </>
    );
  }

  return <>{children}</>; // 관리자일 경우 children을 렌더링
};

export default RequireAdmin; 