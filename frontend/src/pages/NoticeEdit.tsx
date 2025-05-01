import React, {useEffect, useState} from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import axios from '../api/axios';
import {useNavigate, useParams} from 'react-router-dom';
import './Notice.css';

const NoticeEdit: React.FC = () => {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const [content, setContent] = useState('');

    useEffect(() => {
        axios.get(`/notices/${id}`).then((res) => {
            setTitle(res.data.title);
            setContent(res.data.content);
        });
    }, [id]);

    const handleUpdate = async () => {
        try {
            await axios.put(`/notices/${id}`, {
                title,
                content,
                writer: localStorage.getItem('username'),
            });
            alert("수정 완료");
            navigate(`/notices/${id}`);
        } catch (err) {
            alert("수정 실패");
        }
    };

    return (
        <Container>
            <div className="notice-container">
                <h2 className="notice-title">공지사항 수정</h2>
                
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
                        onClick={handleUpdate}
                        className="notice-btn"
                    >
                        저장
                    </Button>
                    
                    <Button 
                        variant="outlined"
                        onClick={() => navigate(`/notices/${id}`)}
                        className="notice-secondary-btn"
                        style={{ marginLeft: '10px' }}
                    >
                        취소
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default NoticeEdit;
