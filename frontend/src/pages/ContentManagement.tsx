import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  FormHelperText,
  Alert,
  Snackbar,
  SelectChangeEvent,
  Card,
  CardContent,
  Tab,
  Tabs
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import { VideoLibrary as VideoIcon, Quiz as QuizIcon } from '@mui/icons-material';
import QuizEditor from '../components/QuizEditor';

// API 요청을 위한 axios 인스턴스 생성
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface Content {
  id: number;
  title: string;
  type: string;
  url: string;
  lectureId: number;
  examId?: string;
}

interface Lecture {
  id: number;
  title: string;
  author: string;
}

interface FormData {
  id?: number;
  title: string;
  type: string;
  url: string;
  lectureId: number;
}

const ContentManagement: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();

  const [contents, setContents] = useState<Content[]>([]);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [quizTab, setQuizTab] = useState<number>(0);
  const [quizEditorVisible, setQuizEditorVisible] = useState<boolean>(false);
  const [examId, setExamId] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: '',
    url: '',
    lectureId: parseInt(lectureId || '0')
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchContents = async () => {
    if (!lectureId) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/admins/contents/lecture/${lectureId}`);
      console.log('컨텐츠 데이터 응답:', response.data);
      
      // 퀴즈 타입인 경우 examId 확인
      const processedContents = response.data.map((content: Content) => {
        if (content.type === 'quiz' && !content.examId && content.url) {
          // url을 examId로 사용
          return { ...content, examId: content.url };
        }
        return content;
      });
      
      setContents(processedContents);
    } catch (error) {
      console.error('Error fetching contents:', error);
      setSnackbar({
        open: true,
        message: '컨텐츠 데이터를 불러오는데 실패했습니다.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLecture = async () => {
    if (!lectureId) return;
    
    try {
      const response = await api.get(`/api/admins/lectures/${lectureId}`);
      setLecture(response.data);
    } catch (error) {
      console.error('Error fetching lecture:', error);
    }
  };

  useEffect(() => {
    fetchLecture();
    fetchContents();
  }, [lectureId]);

  const showAddModal = () => {
    setEditingContent(null);
    setFormData({
      title: '',
      type: 'video',
      url: '',
      lectureId: parseInt(lectureId || '0')
    });
    setFormErrors({});
    setQuizEditorVisible(false);
    setExamId(undefined);
    setQuizTab(0);
    setModalOpen(true);
  };

  const showEditModal = (content: Content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      type: content.type,
      url: content.url,
      lectureId: content.lectureId
    });
    setFormErrors({});
    setQuizEditorVisible(content.type === 'quiz');
    
    // 퀴즈 타입인 경우 URL을 examId로 설정
    if (content.type === 'quiz') {
      // URL에서 이중 슬래시 등의 문제를 정규화
      const examIdValue = content.examId || content.url;
      const normalizedExamId = examIdValue ? examIdValue.replace(/\/+/g, '/') : undefined;
      setExamId(normalizedExamId);
    } else {
      setExamId(undefined);
    }
    
    setQuizTab(content.type === 'quiz' ? 1 : 0);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.title) errors.title = '제목을 입력해주세요';
    if (!formData.type) errors.type = '타입을 선택해주세요';
    if (!formData.url) errors.url = 'URL을 입력해주세요';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      if (editingContent) {
        const updatedContent = { 
          ...formData, 
          examId: formData.type === 'quiz' ? examId : undefined 
        };
        await api.put(`/api/admins/contents/${editingContent.id}`, updatedContent);
        setSnackbar({
          open: true,
          message: '컨텐츠가 수정되었습니다.',
          severity: 'success'
        });
      } else {
        const newContent = { 
          ...formData, 
          examId: formData.type === 'quiz' ? examId : undefined 
        };
        await api.post('/api/admins/contents', newContent);
        setSnackbar({
          open: true,
          message: '새 컨텐츠가 생성되었습니다.',
          severity: 'success'
        });
      }
      
      setModalOpen(false);
      fetchContents();
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({
        open: true,
        message: '컨텐츠 저장에 실패했습니다.',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/admins/contents/${id}`);
      setSnackbar({
        open: true,
        message: '컨텐츠가 삭제되었습니다.',
        severity: 'success'
      });
      fetchContents();
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: '컨텐츠 삭제에 실패했습니다.',
        severity: 'error'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name as keyof FormData]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'type' && value === 'quiz') {
      setQuizEditorVisible(true);
      setQuizTab(1);
    } else if (name === 'type') {
      setQuizEditorVisible(false);
      setQuizTab(0);
    }
    
    if (formErrors[name as keyof FormData]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  const contentTypeOptions = [
    { value: 'video', label: '동영상' },
    { value: 'quiz', label: '퀴즈' },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const goBack = () => {
    navigate('/admin/lectures');
  };

  const getContentTypeLabel = (type: string): string => {
    const option = contentTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoIcon className="content-type-video" />;
      case 'quiz':
        return <QuizIcon className="content-type-quiz" />;
      default:
        return null;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setQuizTab(newValue);
  };

  const handleQuizSave = (savedExamId: string) => {
    // 저장된 ID 정규화
    const normalizedExamId = savedExamId ? savedExamId.replace(/\/+/g, '/') : '';
    setExamId(normalizedExamId);
    setFormData({
      ...formData,
      url: normalizedExamId
    });
    setQuizTab(0);
    setSnackbar({
      open: true,
      message: '퀴즈가 저장되었습니다. 컨텐츠 정보를 입력하고 저장해주세요.',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ padding: 3 }} className="admin-container">
      <Box className="admin-header">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={goBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" className="admin-title">
            {lecture ? `${lecture.title} - 컨텐츠 관리` : '컨텐츠 관리'}
          </Typography>
        </Box>
        <Typography variant="subtitle1" className="admin-subtitle">
          강의 컨텐츠를 추가, 수정, 삭제할 수 있습니다.
        </Typography>
      </Box>
      
      {lecture && (
        <Card sx={{ mb: 4 }} className="admin-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              강의 정보
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography><strong>강의명:</strong> {lecture.title}</Typography>
              <Typography><strong>저자:</strong> {lecture.author}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}
      
      <Box sx={{ marginBottom: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={showAddModal}
          className="admin-button admin-button-primary"
        >
          새 컨텐츠 추가
        </Button>
      </Box>
      
      <TableContainer component={Paper} className="admin-table-container">
        <Table className="admin-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>타입</TableCell>
              <TableCell>URL</TableCell>
              <TableCell align="center">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  등록된 컨텐츠가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.id}</TableCell>
                  <TableCell>{content.title}</TableCell>
                  <TableCell>
                    <Box className="content-preview">
                      {getContentTypeIcon(content.type)}
                      {getContentTypeLabel(content.type)}
                    </Box>
                  </TableCell>
                  <TableCell>{content.url}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        onClick={() => showEditModal(content)}
                        className="admin-action-icon"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(content.id)}
                        className="admin-action-icon"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="admin-modal-title">
          {editingContent ? '컨텐츠 수정' : '새 컨텐츠 추가'}
        </DialogTitle>
        <DialogContent>
          {formData.type === 'quiz' && (
            <Tabs value={quizTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="기본 정보" />
              <Tab label="퀴즈 편집" />
            </Tabs>
          )}
          
          {(quizTab === 0 || formData.type !== 'quiz') && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                name="title"
                label="제목"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                className="admin-form-field"
              />
              
              <FormControl fullWidth error={!!formErrors.type} className="admin-form-field">
                <InputLabel id="type-label">컨텐츠 타입</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={formData.type}
                  label="컨텐츠 타입"
                  onChange={handleSelectChange}
                >
                  {contentTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getContentTypeIcon(option.value)}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
              </FormControl>
              
              {formData.type !== 'quiz' && (
                <TextField
                  name="url"
                  label="URL"
                  fullWidth
                  value={formData.url}
                  onChange={handleInputChange}
                  error={!!formErrors.url}
                  helperText={formErrors.url || '동영상 ID 또는 연결 URL을 입력하세요'}
                  className="admin-form-field"
                />
              )}
              
              {formData.type === 'quiz' && (
                <Box>
                  {examId ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      퀴즈가 준비되었습니다. 기본 정보를 입력한 후 저장하세요.
                    </Alert>
                  ) : (
                    <Alert severity="warning">
                      퀴즈를 편집하려면 '퀴즈 편집' 탭으로 이동하세요.
                    </Alert>
                  )}
                </Box>
              )}
            </Stack>
          )}
          
          {quizTab === 1 && formData.type === 'quiz' && (
            <Box sx={{ mt: 2 }}>
              <QuizEditor 
                lectureId={parseInt(lectureId || '0')}
                contentId={editingContent?.id}
                examId={examId}
                onSave={handleQuizSave}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} className="admin-button admin-button-secondary">취소</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            className="admin-button admin-button-primary"
            disabled={formData.type === 'quiz' && !examId}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentManagement; 