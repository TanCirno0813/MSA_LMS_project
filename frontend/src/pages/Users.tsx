// src/pages/Users.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
  Paper,
  Theme,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Badge,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../api/axios';
import '../styles/admin.css';
import { SxProps } from '@mui/system';

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role : string;
  birthDate: string; // 생년월일 추가
  phone: string; // 전화번호 추가
  address: string; // 주소 추가
}

interface UserCompletion {
  userId: number;
  username: string;
  name: string;
  email: string;
  totalCompletions: number;
  latestCompletion?: {
    lectureId: number;
    lectureTitle: string;
    contentTitle: string;
    completedAt: string;
  };
}

interface CompletionDetail {
  id: number;
  userId: number;
  lectureId: number;
  lectureTitle: string;
  contentTitle: string;
  completedAt: string;
}

interface QuestionResult {
  questionId: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ExamResultResponse {
  id: number;
  examId: number;
  userId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  examTitle: string;
  questionResults: QuestionResult[];
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userForm, setUserForm] = useState<User>({
    id: 0,
    username: '',
    password: '',
    name: '',
    email: '',
    birthDate:'',
    role:'',
    phone: '',
    address: '',
  });
  
  // 탭 관련 상태
  const [tabValue, setTabValue] = useState(0);
  
  // 이수 현황 관련 상태
  const [userCompletions, setUserCompletions] = useState<UserCompletion[]>([]);
  const [completionDetails, setCompletionDetails] = useState<{[key: number]: CompletionDetail[]}>({});
  const [expandedUsers, setExpandedUsers] = useState<{[key: number]: boolean}>({});
  const [loadingCompletions, setLoadingCompletions] = useState<boolean>(false);
  
  // 시험 결과 관련 상태
  const [userExamResults, setUserExamResults] = useState<{[key: number]: ExamResultResponse[]}>({});
  const [expandedExamResults, setExpandedExamResults] = useState<{[key: string]: boolean}>({});
  const [examResultDialogOpen, setExamResultDialogOpen] = useState(false);
  const [selectedExamResult, setSelectedExamResult] = useState<ExamResultResponse | null>(null);
  const [loadingExamResults, setLoadingExamResults] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('사용자 목록을 불러오는데 실패했습니다.', error);
    }
  };

  const fetchCompletionSummary = async () => {
    try {
      setLoadingCompletions(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/completions/admin/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCompletions(response.data);
    } catch (error) {
      console.error('이수 현황을 불러오는데 실패했습니다.', error);
    } finally {
      setLoadingCompletions(false);
    }
  };
  
  const fetchUserCompletionDetails = async (userId: number) => {
    // 이미 로드되었으면 다시 로드하지 않음
    if (completionDetails[userId] && completionDetails[userId].length > 0) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/completions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCompletionDetails(prev => ({
        ...prev,
        [userId]: response.data
      }));
    } catch (error) {
      console.error(`사용자 ID ${userId}의 이수 내역을 불러오는데 실패했습니다.`, error);
    }
  };
  
  const fetchUserExamResults = async (userId: number) => {
    // 이미 로드되었으면 다시 로드하지 않음
    if (userExamResults[userId] && userExamResults[userId].length > 0) {
      console.log('이미 로드된 시험 결과:', userExamResults[userId]);
      return;
    }
    
    try {
      setLoadingExamResults(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/exams/results/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`사용자 ${userId}의 시험 결과 응답:`, response.data);
      
      // 응답 데이터 구조 검증
      if (!response.data || !Array.isArray(response.data)) {
        console.error('API 응답이 예상된 형식이 아닙니다:', response.data);
        setUserExamResults(prev => ({
          ...prev,
          [userId]: []
        }));
        return;
      }
      
      // 각 결과에 questionResults 필드가 있는지 확인
      const validatedResults = response.data.map(result => {
        if (!result.questionResults) {
          console.warn('시험 결과에 questionResults 필드가 없습니다:', result);
          return {
            ...result,
            questionResults: []
          };
        }
        return result;
      });
      
      setUserExamResults(prev => ({
        ...prev,
        [userId]: validatedResults
      }));
    } catch (error) {
      console.error(`사용자 ID ${userId}의 시험 결과를 불러오는데 실패했습니다.`, error);
      setUserExamResults(prev => ({
        ...prev,
        [userId]: []
      }));
    } finally {
      setLoadingExamResults(false);
    }
  };
  
  const toggleUserExpand = (userId: number) => {
    // 접기/펼치기 토글
    setExpandedUsers(prev => {
      const newState = { ...prev, [userId]: !prev[userId] };
      
      // 펼칠 때 상세 내역 로드
      if (newState[userId]) {
        fetchUserCompletionDetails(userId);
      }
      
      return newState;
    });
  };

  const toggleExamResultExpand = (resultId: string) => {
    setExpandedExamResults(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
  };

  const openExamResultDetail = (result: ExamResultResponse) => {
    console.log('시험 결과 상세 정보:', result);
    if (!result || !result.questionResults) {
      console.error('시험 결과 또는 문제 정보가 없습니다:', result);
      alert('시험 결과 데이터를 불러올 수 없습니다.');
      return;
    }
    setSelectedExamResult(result);
    setExamResultDialogOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (tabValue === 1) {
      fetchCompletionSummary();
    } else if (tabValue === 2) {
      fetchUsers();
    }
  }, [tabValue]);

  const handleAdd = () => {
    setIsEdit(false);
    setUserForm({ id: 0, username: '', password: '', name: '', email: '', birthDate: '',role: '', phone: '', address: '' });
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setIsEdit(true);
    setUserForm({ ...user });
    setDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        await api.delete(`/users/${user.id}`);
        fetchUsers();
      } catch (error) {
        console.error('사용자 삭제에 실패했습니다.', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // 날짜 형식 처리 및 제출용 데이터 준비
      const formToSubmit: Partial<User> = {
        ...userForm
      };
      
      // 비밀번호가 비어있는 경우 수정 요청에서 제외
      if (isEdit && !formToSubmit.password) {
        const { password, ...restForm } = formToSubmit;
        if (isEdit) {
          await api.put(`/users/${userForm.id}`, restForm);
        } else {
          await api.post('/users', formToSubmit);
        }
      } else {
        if (isEdit) {
          await api.put(`/users/${userForm.id}`, formToSubmit);
        } else {
          await api.post('/users', formToSubmit);
        }
      }
      
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(isEdit ? '사용자 수정에 실패했습니다.' : '사용자 추가에 실패했습니다.', error);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const renderUserManagement = () => (
    <Card className="admin-card">
      <CardHeader
        title="사용자 목록"
        action={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAdd}
            className="admin-button admin-button-primary"
          >
            새 사용자
          </Button>
        }
      />
      <CardContent>
        <TableContainer className="admin-table-container">
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>사용자 ID</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>생년월일</TableCell>
                <TableCell>권한</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    등록된 사용자가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.birthDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role === "ADMIN" ? "관리자" : "일반 사용자"} 
                      color={user.role === "ADMIN" ? "primary" : "default"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                      <IconButton onClick={() => handleEdit(user)} className="admin-action-icon">
                      <EditIcon />
                    </IconButton>
                      <IconButton onClick={() => handleDelete(user)} className="admin-action-icon">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
  
  const renderCompletionManagement = () => (
    <Card className="admin-card">
      <CardHeader
        title="사용자 이수 현황"
        action={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchCompletionSummary}
            className="admin-button admin-button-primary"
          >
            새로고침
          </Button>
        }
      />
      <CardContent>
        {loadingCompletions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>이수 현황을 불러오는 중...</Typography>
          </Box>
        ) : userCompletions.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>이수 기록이 없습니다.</Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {userCompletions.map((user) => (
              <React.Fragment key={user.userId}>
                <ListItem
                  component="div"
                  onClick={() => toggleUserExpand(user.userId)}
                  secondaryAction={
                    <Badge
                      badgeContent={user.totalCompletions}
                      color="primary"
                      sx={{ mr: 2 }}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography component="span" variant="subtitle1">
                          {user.name} ({user.username})
                        </Typography>
                      </Box>
                    }
                    secondary={
                      user.latestCompletion ? (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <SchoolIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography component="span" variant="body2" color="text.secondary">
                            최근: {user.latestCompletion.lectureTitle} - {user.latestCompletion.contentTitle} ({formatDate(user.latestCompletion.completedAt)})
                          </Typography>
                        </Box>
                      ) : (
                        "이수 내역 없음"
                      )
                    }
                  />
                  {expandedUsers[user.userId] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                
                <Collapse in={expandedUsers[user.userId]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {!completionDetails[user.userId] ? (
                      <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="상세 내역을 불러오는 중..." />
                      </ListItem>
                    ) : completionDetails[user.userId].length === 0 ? (
                      <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="이수 내역이 없습니다." />
                      </ListItem>
                    ) : (
                      completionDetails[user.userId].map((completion) => (
                        <ListItem key={completion.id} sx={{ pl: 4 }}>
                          <PlayCircleOutlineIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">
                                  {completion.contentTitle}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(completion.completedAt)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {completion.lectureTitle}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderExamResults = () => (
    <Card className="admin-card">
      <CardHeader
        title="사용자 시험 결과"
        action={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchUsers}
            className="admin-button admin-button-primary"
          >
            새로고침
          </Button>
        }
      />
      <CardContent>
        {users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>등록된 사용자가 없습니다.</Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem
                  onClick={() => {
                    fetchUserExamResults(user.id);
                    toggleUserExpand(user.id);
                  }}
                >
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography component="span" variant="subtitle1">
                          {user.name} ({user.username})
                        </Typography>
                      </Box>
                    }
                  />
                  {expandedUsers[user.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                
                <Collapse in={expandedUsers[user.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ bgcolor: 'background.paper' }}>
                    {loadingExamResults ? (
                      <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="시험 결과를 불러오는 중..." />
                      </ListItem>
                    ) : !userExamResults[user.id] ? (
                      <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="시험 결과를 불러오는 중..." />
                      </ListItem>
                    ) : userExamResults[user.id].length === 0 ? (
                      <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="시험 결과가 없습니다." />
                      </ListItem>
                    ) : (
                      userExamResults[user.id].map((result) => (
                        <React.Fragment key={`exam-${result.id}`}>
                          <ListItem 
                            sx={{ pl: 4 }}
                            onClick={() => openExamResultDetail(result)}
                          >
                            <AssignmentIcon sx={{ mr: 2, color: result.passed ? 'success.main' : 'error.main' }} />
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2">
                                    {result.examTitle}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Chip 
                                      label={`${result.score}점`} 
                                      size="small" 
                                      color={result.passed ? "success" : "error"}
                                      sx={{ mr: 1 }}
                                    />
                                    <Chip 
                                      icon={result.passed ? <CheckCircleIcon /> : <CancelIcon />} 
                                      label={result.passed ? "합격" : "불합격"} 
                                      size="small" 
                                      color={result.passed ? "success" : "error"}
                                    />
                                  </Box>
                                </Box>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  맞은 문제: {result.correctAnswers} / {result.totalQuestions}
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider component="li" variant="inset" />
                        </React.Fragment>
                      ))
                    )}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box className="admin-container">
      <Box className="admin-header">
        <Typography variant="h4" className="admin-title">
          <PersonIcon sx={{ mr: 2 }} /> 사용자 관리
        </Typography>
        <Typography variant="subtitle1" className="admin-subtitle">
          시스템 사용자를 관리할 수 있습니다.
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="사용자 관리 탭">
          <Tab label="사용자 목록" />
          <Tab label="이수 현황" />
          <Tab label="시험 결과" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && renderUserManagement()}
      {tabValue === 1 && renderCompletionManagement()}
      {tabValue === 2 && renderExamResults()}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle className="admin-modal-title">{isEdit ? '사용자 수정' : '새 사용자 추가'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="사용자 ID"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              className="admin-form-field"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
            
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              className="admin-form-field"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="이름"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="admin-form-field"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="이메일"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="admin-form-field"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="생년월일"
              value={userForm.birthDate}
              onChange={(e) => setUserForm({ ...userForm, birthDate: e.target.value })}
              className="admin-form-field"
              sx={{ mb: 2 }}
              placeholder="YYYY-MM-DD"
            />
            <TextField
              fullWidth
              label="전화번호"
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              className="admin-form-field"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="주소"
              value={userForm.address}
              onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
              className="admin-form-field"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="role-select-label">권한</InputLabel>
              <Select
                labelId="role-select-label"
                value={userForm.role || 'USER'}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                label="권한"
              >
                <MenuItem value="USER">일반 사용자</MenuItem>
                <MenuItem value="ADMIN">관리자</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} className="admin-button admin-button-secondary">취소</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" className="admin-button admin-button-primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={examResultDialogOpen} 
        onClose={() => setExamResultDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="admin-modal-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">성적표</Typography>
            {selectedExamResult && (
              <Chip 
                icon={selectedExamResult.passed ? <CheckCircleIcon /> : <CancelIcon />}
                label={selectedExamResult.passed ? "합격" : "불합격"} 
                color={selectedExamResult.passed ? "success" : "error"}
                size="medium"
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedExamResult && (
            <Box sx={{ mb: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">시험 제목</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{selectedExamResult.examTitle}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">응시일</Typography>
                    <Typography variant="subtitle1">{new Date().toLocaleDateString('ko-KR')}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">총 문항 수</Typography>
                    <Typography variant="subtitle1">{selectedExamResult.totalQuestions}문제</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">정답 개수</Typography>
                    <Typography variant="subtitle1">{selectedExamResult.correctAnswers}개</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">점수</Typography>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      color={selectedExamResult.passed ? "success.main" : "error.main"}
                    >
                      {selectedExamResult.score}점
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">결과</Typography>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      color={selectedExamResult.passed ? "success.main" : "error.main"}
                    >
                      {selectedExamResult.passed ? "합격" : "불합격"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
               답안 비교
              </Typography>
              
              {selectedExamResult.questionResults && selectedExamResult.questionResults.length > 0 ? (
                selectedExamResult.questionResults.map((qResult, idx) => (
                  <Paper 
                    key={`q-${qResult.questionId}`} 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      borderColor: 'divider',
                      borderWidth: 1
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 2, 
                      p: 1,
                      backgroundColor: 'background.paper',
                      borderRadius: 1
                    }}>
                      <Box 
                        sx={{ 
                          minWidth: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          backgroundColor: 'primary.main',
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        {idx + 1}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {qResult.question}
                        </Typography>
                      
                      </Box>
                    </Box>
                    
                    <Box sx={{ ml: 7, mb: 2 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.primary', 
                        mb: 0.5,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        정답:
                      </Typography>
                      <Box sx={{ 
                        p: 1.5, 
                        backgroundColor: '#e3f2fd',
                        borderRadius: 1,
                        borderLeft: '4px solid',
                        borderColor: 'primary.main'
                      }}>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{qResult.correctAnswer}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ ml: 7 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.primary', 
                        mb: 0.5,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        응시자 답변:
                      </Typography>
                      <Box sx={{ 
                        p: 1.5, 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: 1,
                        borderLeft: '4px solid',
                        borderColor: 'grey.500'
                      }}>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                          {qResult.userAnswer ? qResult.userAnswer : '(답변 없음)'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    문제 데이터가 없습니다.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => {
                      if (selectedExamResult) {
                        console.log('시험 결과를 다시 불러오는 중...', selectedExamResult);
                      }
                    }}
                  >
                    다시 불러오기
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          
          <Button 
            variant="outlined"
            onClick={() => setExamResultDialogOpen(false)}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;