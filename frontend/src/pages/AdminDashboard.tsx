import { Link, Outlet, useLocation } from 'react-router-dom';
import { Typography,  Container, Box, } from '@mui/material';
import { Dashboard as DashboardIcon, PersonOutline as PersonIcon, 
         VideoLibrary as LectureIcon } from '@mui/icons-material';
import '../styles/admin.css';

const AdminDashboard = () => {
    const location = useLocation();

    return (
        <div className="admin-container">
            {/* 사이드바 */}
            <div className="admin-sidebar">
                <Typography variant="h6" align="center" sx={{ mb: 3, p: 2 }}>
                    관리자 대시보드
                </Typography>
                <ul className="admin-sidebar-menu">
                   
                    <li className={`admin-sidebar-item ${location.pathname.includes('/admin/users') ? 'active' : ''}`}>
                        <Link to="/admin/users" className="admin-sidebar-link">
                            <PersonIcon />
                            사용자 관리
                        </Link>
                    </li>
                    <li className={`admin-sidebar-item ${location.pathname.includes('/admin/lectures') ? 'active' : ''}`}>
                        <Link to="/admin/lectures" className="admin-sidebar-link">
                            <LectureIcon />
                            강의 관리
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="admin-content">
                {location.pathname === '/admin' ? (
                    <Container>
                        <Box className="admin-header">
                            <Typography variant="h4" className="admin-title">
                                <DashboardIcon sx={{ mr: 2 }} /> 관리자 대시보드
                            </Typography>
                            <Typography variant="subtitle1" className="admin-subtitle">
                                사이트 통계 및 관리 현황을 한눈에 확인하세요.
                            </Typography>
                        </Box>

                    </Container>
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;