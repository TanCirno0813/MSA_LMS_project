import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import {
    Box, Typography, TextField, Button, List,
    ListItem, ListItemButton, ListItemText, Paper, Container,
    Chip, Avatar, MenuItem, Modal, CircularProgress
} from '@mui/material';
import api from '../api/axios';

interface Completion {
    lectureId: number;
    lectureTitle: string;
    contentTitle: string;
    completedAt: string;
    isCompleted: boolean; // ✅ 추가
}

interface UserInfo {
    username?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    addressDetail?: string;
    birthYear?: string;
    birthMonth?: string;
    birthDay?: string;
    birthDate?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

const Mypage: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>({});
    const [completionHistory, setCompletionHistory] = useState<Completion[]>([]);
    const [view, setView] = useState<'info' | 'edit' | 'history'>('info');
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [authCode, setAuthCode] = useState('');
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [originalPhone, setOriginalPhone] = useState('');

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const birth = res.data.birthDate?.split('-') || [];
            setOriginalPhone(res.data.phone || '');

            setUserInfo({
                ...res.data,
                birthYear: birth[0] || '',
                birthMonth: birth[1] || '',
                birthDay: birth[2] || '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                addressDetail: '',
            });
        } catch (err) {
            console.error('❌ 사용자 정보 불러오기 실패', err);
            alert('로그인이 필요합니다.');
        }
    };

    const fetchCompletions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/completions/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const completionsWithTitles: Completion[] = res.data.map((item: any) => ({
                ...item,
                lectureTitle: item.lectureTitle || `강의 ${item.lectureId}`,
                contentTitle: item.contentTitle || '강의 콘텐츠',
                isCompleted: item.watchedTime && item.totalDuration
                    ? item.watchedTime >= item.totalDuration * 0.95
                    : false // ✅ 95% 이상 시 이수 처리
            }));



            setCompletionHistory(completionsWithTitles);
        } catch (err) {
            console.error('❌ 이수 내역 불러오기 실패', err);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchCompletions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setUserInfo((prev: UserInfo) => ({
            ...prev,
            [name!]: value
        }));
    };

    const handleAddressComplete = (data: any) => {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setUserInfo((prev: UserInfo) => ({ ...prev, address: fullAddress }));
        setAddressModalOpen(false); // 모달 닫기
    };

    const sendAuthCode = async () => {
        try {
            setSending(true);
            const fullPhone = userInfo.phone?.replace(/-/g, '');  // 하이픈 제거

            if (!fullPhone || fullPhone.length !== 11) {
                alert('올바른 전화번호를 입력해주세요.');
                return;
            }

            const response = await api.post('/sms/send', { phone: fullPhone });
            console.log(response.data); // 응답 확인

            if (response.data) {
                alert('인증번호가 발송되었습니다.');
                setSent(true);  // 인증번호 발송 후 입력 필드 보이기
                setAuthCode(''); // 인증번호 초기화
            } else {
                alert('인증번호 발송 실패1111');
            }

        } catch (error) {
            console.error('SMS 발송 실패', error);
            alert('SMS 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setSending(false);  // 인증 발송 중 상태 해제
        }
    };

    const verifyAuthCode = async () => {
        try {
            const fullPhone = userInfo.phone?.replace(/-/g, '');
            if (!fullPhone || fullPhone.length !== 11) {
                alert('올바른 전화번호를 입력해주세요.');
                return;
            }

            const response = await api.post('/sms/verify', {
                phone: fullPhone,
                code: authCode, // 입력된 인증번호
            });

            if (response.data.success) {
                alert('인증에 성공했습니다.');
                setPhoneVerified(true);  // 인증 성공 후 저장 가능
            } else {
                alert('인증번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('인증 실패', error);
            alert('인증 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const handleUpdate = async () => {
        if (userInfo.phone !== originalPhone && !phoneVerified) {
            alert('전화번호를 변경하려면 인증이 필요합니다.');
            return;
        }

        const {
            name, email, phone, address, addressDetail,
            birthYear, birthMonth, birthDay,
            currentPassword, newPassword, confirmNewPassword
        } = userInfo;

        if ((newPassword || confirmNewPassword) && newPassword !== confirmNewPassword) {
            alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        let birthDate = '';
        if (birthYear && birthMonth && birthDay) {
            birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
        }

        const fullAddress = `${address} ${addressDetail || ''}`.trim();

        const payload: any = { name, email, phone, address: fullAddress };
        if (birthDate) payload.birthDate = birthDate;
        if (newPassword) {
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }

        try {
            await api.put('/users/me', payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setSent(false);
            setAuthCode('');
            setPhoneVerified(false);
            await fetchUserInfo();

            alert('정보가 수정되었습니다.');
            setView('info');
        } catch (err: any) {
            if (err.response?.data) {
                alert(`수정 실패: ${err.response.data}`);
            } else {
                alert('수정 요청 중 오류가 발생했습니다.');
            }
        }
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

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
                                            label={item.isCompleted ? "이수완료" : "진행 중"}
                                            color={item.isCompleted ? "success" : "default"}
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

    const renderEditView = () => {
        const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
        const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
        const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

        return (
            <Box component={Paper} p={3} sx={{ borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>정보 수정</Typography>
                <TextField label="아이디" fullWidth disabled value={userInfo.username || ''} margin="normal" />
                <TextField label="이름" name="name" fullWidth value={userInfo.name || ''} onChange={handleChange} margin="normal" />
                <TextField label="현재 비밀번호" name="currentPassword" type="password" fullWidth onChange={handleChange} margin="normal" />
                <TextField label="새 비밀번호" name="newPassword" type="password" fullWidth onChange={handleChange} margin="normal" />
                <TextField label="새 비밀번호 확인" name="confirmNewPassword" type="password" fullWidth onChange={handleChange} margin="normal" />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>생년월일</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField select label="년" name="birthYear" value={userInfo.birthYear || ''} onChange={handleChange} sx={{ flex: 1 }}>
                        {years.map(year => (
                            <MenuItem key={year} value={year.toString()}>{year}년</MenuItem>
                        ))}
                    </TextField>
                    <TextField select label="월" name="birthMonth" value={userInfo.birthMonth || ''} onChange={handleChange} sx={{ flex: 1 }}>
                        {months.map(month => (
                            <MenuItem key={month} value={month}>{month}월</MenuItem>
                        ))}
                    </TextField>
                    <TextField select label="일" name="birthDay" value={userInfo.birthDay || ''} onChange={handleChange} sx={{ flex: 1 }}>
                        {days.map(day => (
                            <MenuItem key={day} value={day}>{day}일</MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Typography variant="h6">전화번호 인증</Typography>
                <TextField label="전화번호" fullWidth value={userInfo.phone || ''} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} margin="normal" variant="outlined" />

                <Button variant="contained" color="primary" onClick={sendAuthCode} disabled={sending || sent} sx={{ mt: 2 }}>
                    {sending ? <CircularProgress size={24} /> : '인증번호 발송'}
                </Button>

                {sent && (
                    <Box sx={{ mt: 3 }}>
                        <TextField label="인증번호" fullWidth value={authCode} onChange={(e) => setAuthCode(e.target.value)} margin="normal" variant="outlined" />
                        <Button variant="contained" color="primary" onClick={verifyAuthCode} sx={{ mt: 2 }}>
                            인증번호 확인
                        </Button>
                    </Box>
                )}

                <TextField label="이메일" name="email" fullWidth value={userInfo.email || ''} onChange={handleChange} margin="normal" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TextField label="주소" name="address" fullWidth value={userInfo.address || ''} onChange={handleChange} margin="normal" />
                    <Button variant="contained" onClick={() => setAddressModalOpen(true)} sx={{ mt: 2 }}>주소 검색</Button>
                </div>
                <TextField label="상세 주소" name="addressDetail" fullWidth value={userInfo.addressDetail || ''} onChange={handleChange} margin="normal" />

                <Box mt={9} display="flex" gap={2}>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>저장</Button>
                    <Button variant="outlined" onClick={() => setView('info')}>취소</Button>
                </Box>
                <Modal open={addressModalOpen} onClose={() => setAddressModalOpen(false)}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 2 }}>
                        <DaumPostcode onComplete={handleAddressComplete} />
                    </Box>
                </Modal>
            </Box>
        );
    };

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
                    Object.entries(groupedCompletions).map(([lectureId, completions]) => (
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
                                                    {completion.isCompleted
                                                        ? `${formatDate(completion.completedAt)} 수료`
                                                        : "진행 중"}
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
