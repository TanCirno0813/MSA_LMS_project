import { Navigate } from 'react-router-dom';

// @ts-ignore
const RequireGuest = ({ children }) => {
    const token = localStorage.getItem('token');  // 👉 localStorage나 원하는 방식으로 로그인 상태 확인

    if (token) {
        // 이미 로그인 상태 → 메인 페이지로 리다이렉트
        return <Navigate to="/" replace />;
    }

    return children; // 비로그인 상태 → children (로그인 페이지) 보여줌
};

export default RequireGuest;
