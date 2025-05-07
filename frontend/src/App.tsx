import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline, AppBar} from '@mui/material'
import { theme } from './theme'
import HomeView from './pages/HomeView'
import Users from './pages/Users'
import Logins from './pages/Login'
import Register from './pages/Register';
import Mypage from './pages/Mypage.tsx';
import NoticeList from './pages/NoticeList';
import NoticeDetail from './pages/NoticeDetail';
import NoticeWrite from './pages/NoticeWrite';
import NoticeEdit from './pages/NoticeEdit';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LectureList from "./pages/LectureList";
import ExamPage from "./pages/ExamPage";
import LectureDetail from './pages/LectureDetail';
import VideoPage from "@/pages/VideoPage.tsx";
import ResultReportPage from "./pages/ResultReportPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx"
import LectureAdminPage from "./pages/LectureManagement.tsx"
import ContentManagement from './pages/ContentManagement';
import LectureManagement from './pages/LectureManagement';
import ReviewList from './pages/ReviewList.tsx';
import EnrollmentManagement from './pages/EnrollmentManagement';


const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');
        const storeUserId = localStorage.getItem('userId')
        setRole(storedRole);
        setUsername(storedUsername);
        setUserId(storeUserId)
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('userId')
        setUsername(null);
        setRole(null);
        setUserId(null)

        window.dispatchEvent(new Event('auth-change'));

        window.location.href = '/';
    };

    // 로그인 처리 함수
    const handleLogin = (u: string, r: string, i: string) => {
        localStorage.setItem('username', u);
        localStorage.setItem('role', r);
        localStorage.setItem('userId',i);
        setUsername(u);
        setRole(r);
        setUserId(i)

        // 로그인 시 auth-change 이벤트 발생
        window.dispatchEvent(new Event('auth-change'));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <div>
                    <Header username={username} role={role} onLogout={handleLogout} />
                    <NavBar />
                </div>
            </AppBar>


            <Routes>
                <Route path="/" element={<HomeView />}/>

                <Route path="/login" element={<Logins onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/reviews" element={<ReviewList />} />
                <Route path="/notices" element={<NoticeList />} />
                <Route path="/notices/:id" element={<NoticeDetail />} />
                <Route path="/notices/write" element={<NoticeWrite />} />
                <Route path="/notices/edit/:id" element={<NoticeEdit />} />
                <Route path="/lectures" element={<LectureList />} />
                <Route path="/quiz/:lectureId" element={<ExamPage />} />
                <Route path="/lectures/:id" element={<LectureDetail />} />
                <Route path="/lectures/:lectureId/video/:videoId" element={<VideoPage />} />
                <Route path="/result" element={<ResultReportPage />} />
                <Route path="/admin" element={<AdminDashboard />}>

                    <Route path="users" element={<Users />} />
                    <Route path="lectures" element={<LectureAdminPage />} />
                    <Route path="enrollments" element={<EnrollmentManagement />} />
                </Route>
                <Route path="/admin/lectures" element={<LectureManagement />} />
                <Route path="/admin/lectures/:lectureId/contents" element={<ContentManagement />} />
            </Routes>

            <Footer />
        </ThemeProvider>
    )
}

export default App;