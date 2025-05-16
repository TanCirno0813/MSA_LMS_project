import React, { useEffect, useState } from 'react';
import { Notice } from '../../types/Notice.ts';
import axios from '../api/axios';
import {
    Box, Typography, List, ListItemText, Divider, ListItemButton, Button, Container,
    Pagination
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './Notice.css';

const NoticeList: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 4;
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/notices');
                setNotices(res.data);
                setError(null);
            } catch (err) {
                console.error('공지사항 목록 불러오기 실패:', err);
                setError('공지사항을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE);
    const paginatedNotices = notices.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <Container>
                <Box mt={5} display="flex" justifyContent="center">
                    <Typography>로딩 중...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box mt={5} display="flex" justifyContent="center">
                    <Typography color="error">{error}</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <div className="notice-container">
                <h2 className="notice-title">📢 공지사항</h2>
                
                {notices.length === 0 ? (
                    <div className="notice-empty">등록된 공지사항이 없습니다.</div>
                ) : (
                    <>
                        <List className="notice-list">
                            {paginatedNotices.map(notice => (
                                <React.Fragment key={notice.id}>
                                    <ListItemButton
                                        component={Link}
                                        to={`/notices/${notice.id}`}
                                        className="notice-list-item"
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography className="notice-list-item-title">{notice.title}</Typography>
                                            }
                                            secondary={
                                                <Box className="notice-list-item-meta" component="span">
                                                    <span>{notice.writer}</span>
                                                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                    <Divider key={`divider-${notice.id}`} />
                                </React.Fragment>
                            ))}
                        </List>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                            <Pagination 
                                count={totalPages} 
                                page={page} 
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        fontSize: '1.1rem',
                                        '&.Mui-selected': {
                                            backgroundColor: '#028267',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#026657',
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </>
                )}
                {role === 'ADMIN' && (
                    <div className="notice-btn-container">
                        <Button 
                            variant="contained" 
                            onClick={() => navigate('/notices/write')}
                            className="notice-btn"
                        >
                            공지사항 작성
                        </Button>
                    </div>
                )}
            </div>

        </Container>
    );
};

export default NoticeList;
