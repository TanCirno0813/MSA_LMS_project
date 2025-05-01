import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Notice.css';

const NoticeWrite: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const writer = localStorage.getItem('username'); // 로그인 사용자
        if (!writer) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await axios.post('/notices', { title, content, writer });
            alert('공지사항이 등록되었습니다.');
            navigate('/notices');
        } catch (err) {
            console.error(err);
            alert('공지 등록 실패');
        }
    };

    return (
        <Container>
            <div className="notice-container">
                <h2 className="notice-title">공지사항 작성</h2>
                
                <TextField
                    label="제목"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="notice-form-field"
                />
                
                <TextField
                    label="내용"
                    fullWidth
                    multiline
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="notice-form-content"
                />
                
                <div className="notice-btn-container">
                    <Button 
                        variant="contained" 
                        onClick={handleSubmit}
                        className="notice-btn"
                    >
                        등록
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default NoticeWrite;
