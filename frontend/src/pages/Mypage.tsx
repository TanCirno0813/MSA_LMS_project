import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button, List,
    ListItem, ListItemButton, ListItemText, Paper, Container,
     Chip, Avatar
} from '@mui/material';

import api from '../api/axios';

interface Completion {
    lectureId: number;
    lectureTitle: string;
    contentTitle: string;
    completedAt: string;
}

const Mypage: React.FC = () => {
    const [userInfo, setUserInfo] = useState<any>({});
    const [completionHistory, setCompletionHistory] = useState<Completion[]>([]);
    const [view, setView] = useState<'info' | 'edit' | 'history'>('info');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await api.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserInfo(res.data);

                const completionRes = await api.get('/completions/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // API 응답에서 contentTitle을 사용
                const completionsWithTitles: Completion[] = completionRes.data.map((item: any) => {
                    return {
                        ...item,
                        lectureTitle: item.lectureTitle || `강의 ${item.lectureId}`,
                        contentTitle: item.contentTitle || '강의 콘텐츠'
                    };
                });

                console.log("최종 이수 내역:", completionsWithTitles);
                setCompletionHistory(completionsWithTitles);

            } catch (err) {
                console.error("❌ Mypage fetch 실패", err);
                alert('로그인이 필요합니다.');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await api.put('/users/me', userInfo, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('정보가 수정되었습니다.');
            setView('info');
        } catch (err) {
            alert('수정 실패');
        }
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 이수 이력을 강의별로 그룹화하는 함수
    const groupCompletionsByLecture = () => {
        const groupedCompletions: { [key: string]: Completion[] } = {};
        
        completionHistory.forEach(completion => {
            const key = `${completion.lectureId}`;
            if (!groupedCompletions[key]) {
                groupedCompletions[key] = [];
            }
            groupedCompletions[key].push(completion);
        });
        
        return groupedCompletions;
    };

    const renderInfoView = () => (
        <Box component={Paper} p={3} sx={{ borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>내 정보</Typography>
            <TextField label="아이디" fullWidth disabled value={userInfo.username || ''} margin="normal" />
            <TextField label="이름" fullWidth disabled value={userInfo.name || ''} margin="normal" />
            <TextField label="이메일" fullWidth disabled value={userInfo.email || ''} margin="normal" />
            <TextField label="전화번호" fullWidth disabled value={userInfo.phone || ''} margin="normal" />
            <TextField label="주소" fullWidth disabled value={userInfo.address || ''} margin="normal" />
            <TextField label="생년월일" fullWidth disabled value={userInfo.birthDate || ''} margin="normal" />
            <Button variant="contained" color="primary" onClick={() => setView('edit')} sx={{ mt: 2 }}>
                정보 수정
            </Button>

            <Box mt={4} sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">최근 이수 이력</Typography>
                    <Button variant="text" color="primary" size="small" onClick={() => setView('history')}>
                        전체보기
                    </Button>
                </Box>
                {completionHistory.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        아직 이수한 강의가 없습니다.
                    </Typography>
                ) : (
                    <List>
                        {completionHistory.slice(0, 3).map((item, idx) => (
                            <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.contentTitle}</Typography>
                                        <Chip 
                                            size="small"
                                            label="이수완료"
                                            color="success"
                                            sx={{ height: 24 }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', fontSize: '0.875rem' }}>
                                        <span>{item.lectureTitle}</span>
                                        <span>{formatDate(item.completedAt)}</span>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );

    const renderEditView = () => (
        <Box component={Paper} p={3} sx={{ borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>정보 수정</Typography>
            <TextField label="아이디" fullWidth disabled value={userInfo.username || ''} margin="normal" />
            <TextField label="이름" name="name" fullWidth value={userInfo.name || ''} onChange={handleChange} margin="normal" />
            <TextField label="이메일" name="email" fullWidth value={userInfo.email || ''} onChange={handleChange} margin="normal" />
            <TextField label="전화번호" name="phone" fullWidth value={userInfo.phone || ''} onChange={handleChange} margin="normal" />
            <TextField label="주소" name="address" fullWidth value={userInfo.address || ''} onChange={handleChange} margin="normal" />
            <Box mt={2} display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                    저장
                </Button>
                <Button variant="outlined" onClick={() => setView('info')}>
                    취소
                </Button>
            </Box>
        </Box>
    );

    const renderHistoryView = () => {
        const groupedCompletions = groupCompletionsByLecture();
        
        return (
            <Box component={Paper} p={3} sx={{ borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>이수 이력</Typography>
                
                {Object.keys(groupedCompletions).length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        아직 이수한 강의가 없습니다.
                    </Typography>
                ) : (
                    Object.entries(groupedCompletions).map(([lectureId, completions], index) => (
                        <Box key={lectureId} sx={{ mb: 3 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 1,
                                pb: 1,
                                borderBottom: '1px solid #eee'
                            }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32, fontSize: '0.875rem' }}>
                                    {completions[0].lectureTitle.charAt(0)}
                                </Avatar>
                                <Typography variant="h6" fontSize="1.1rem">
                                    {completions[0].lectureTitle}
                                </Typography>
                                <Chip 
                                    size="small" 
                                    label={`${completions.length}개 수료`} 
                                    color="primary" 
                                    sx={{ ml: 'auto', height: 24 }}
                                />
                            </Box>
                            
                            <List disablePadding>
                                {completions.map((completion, idx) => (
                                    <ListItem key={idx} sx={{ 
                                        py: 1, 
                                        px: 2,
                                        borderLeft: '3px solid #e0e0e0',
                                        mb: 1,
                                        borderRadius: '4px',
                                        bgcolor: 'background.paper'
                                    }}>
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography fontWeight="medium">
                                                    {completion.contentTitle}
                                                </Typography>
                                                <Typography color="text.secondary" fontSize="0.875rem">
                                                    {formatDate(completion.completedAt)} 수료
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))
                )}
            </Box>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', position: 'relative' }}>
                <Box
                    sx={{
                        width: 200,
                        flexShrink: 0,
                        position: { xs: 'relative', md: 'sticky' },
                        top: 16,
                        height: 'fit-content',
                        alignSelf: 'flex-start'
                    }}
                >
                    <Paper elevation={1} sx={{ borderRadius: 2 }}>
                        <List component="nav" aria-label="mypage navigation">
                            <ListItem disablePadding>
                                <ListItemButton selected={view === 'info'} onClick={() => setView('info')}>
                                    <ListItemText primary="내 정보" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton selected={view === 'edit'} onClick={() => setView('edit')}>
                                    <ListItemText primary="정보 수정" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton selected={view === 'history'} onClick={() => setView('history')}>
                                    <ListItemText primary="이수 이력" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Box>

                <Box sx={{ flexGrow: 1, ml: { xs: 2, md: 4 } }}>
                    <Typography variant="h4" gutterBottom>마이페이지</Typography>
                    {view === 'info' && renderInfoView()}
                    {view === 'edit' && renderEditView()}
                    {view === 'history' && renderHistoryView()}
                </Box>
            </Box>
        </Container>
    );
};

export default Mypage;
