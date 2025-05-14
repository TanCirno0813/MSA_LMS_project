import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from '../api/axios';
import { Box, Typography, Divider, Button, Container } from '@mui/material';
import './Notice.css';

interface Notice {
    id: number;
    title: string;
    content: string;
    writer: string;
    createdAt: string;
}

const NoticeDetail: React.FC = () => {
    const { id } = useParams();
    const [notice, setNotice] = useState<Notice | null>(null);
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axios.get(`/notices/${id}`);
                setNotice(res.data);
            } catch (err) {
                console.error('공지사항 불러오기 실패', err);
            }
        };

        fetchNotice();
    }, [id]);

    if (!notice) return (
        <Container>
            <Box mt={5} display="flex" justifyContent="center">
                <Typography>로딩 중...</Typography>
            </Box>
        </Container>
    );

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`/notices/${notice?.id}`);
            alert("삭제되었습니다.");
            navigate('/notices');
        } catch (err) {
            alert("삭제 실패");
        }
    };

    return (
        <Container>
            <div className="notice-container">
                <h1 className="notice-detail-title">{notice.title}</h1>
                <div className="notice-detail-meta">
                    {notice.writer} | {new Date(notice.createdAt).toLocaleDateString()}
                </div>
                
                <Divider className="notice-detail-divider" />
                
                <div className="notice-detail-content">
                    {notice.content}
                </div>
                
                {role === 'ADMIN' && (
                    <div className="notice-btn-container">
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/notices/edit/${notice.id}`)}
                            className="notice-secondary-btn"
                        >
                            수정
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleDelete}
                            className="notice-delete-btn-notice"
                        >
                            삭제
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default NoticeDetail;
