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

} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, List as ListIcon, Book as LectureIcon } from '@mui/icons-material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/admin.css';

// API 요청을 위한 axios 인스턴스 생성
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface Lecture {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  thumbnail: string;
}

interface FormData {
  id?: number;
  title: string;
  author: string;
  description: string;
  category: string;
  thumbnail: string;
}

const LectureManagement: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: '',
    description: '',
    category: '',
    thumbnail: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchLectures = async () => {
    setLoading(true);
    try {
      let url = '/api/admins/lectures';
      if (searchKeyword || selectedCategory) {
        url += '?';
        if (searchKeyword) url += `keyword=${encodeURIComponent(searchKeyword)}`;
        if (selectedCategory) {
          if (searchKeyword) url += '&';
          url += `category=${encodeURIComponent(selectedCategory)}`;
        }
      }
      
      const response = await api.get(url);
      console.log('API Response:', response.data);
      
      const lecturesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.lectures || []);
        
      setLectures(lecturesData);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      setSnackbar({
        open: true,
        message: '강의 데이터를 불러오는데 실패했습니다.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const handleSearch = () => {
    fetchLectures();
  };

  const resetSearch = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    fetchLectures();
  };

  const showAddModal = () => {
    setEditingLecture(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      category: '',
      thumbnail: ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const showEditModal = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setFormData({
      title: lecture.title,
      author: lecture.author,
      description: lecture.description,
      category: lecture.category,
      thumbnail: lecture.thumbnail
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.title) errors.title = '제목을 입력해주세요';
    if (!formData.author) errors.author = '저자를 입력해주세요';
    if (!formData.category) errors.category = '카테고리를 선택해주세요';
    if (!formData.description) errors.description = '설명을 입력해주세요';
    if (!formData.thumbnail) errors.thumbnail = '썸네일 URL을 입력해주세요';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      if (editingLecture) {
        await api.put(`/api/admins/lectures/${editingLecture.id}`, formData);
        setSnackbar({
          open: true,
          message: '강의가 수정되었습니다.',
          severity: 'success'
        });
      } else {
        // 새 강의 추가 시에는 ID 필드를 제거 (백엔드에서 자동생성)
        const newLecture = { ...formData };
        delete newLecture.id;
        
        await api.post('/api/admins/lectures', newLecture);
        setSnackbar({
          open: true,
          message: '새 강의가 생성되었습니다.',
          severity: 'success'
        });
      }
      
      setModalOpen(false);
      fetchLectures();
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({
        open: true,
        message: '강의 저장에 실패했습니다.',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/admins/lectures/${id}`);
      setSnackbar({
        open: true,
        message: '강의가 삭제되었습니다.',
        severity: 'success'
      });
      fetchLectures();
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: '강의 삭제에 실패했습니다.',
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
    setFormData({ ...formData, category: value });
    
    if (formErrors.category) {
      setFormErrors({ ...formErrors, category: undefined });
    }
  };

  const categoryOptions = [
    { value: '공통 필수', label: '공통 필수' },
    { value: '신입사원', label: '신입사원' },
    { value: '사무 기획', label: '사무 기획' },
    { value: '리더십/관리자', label: '리더십/관리자' },
    { value: '자기개발', label: '자기개발' },
    { value: '디지털 시대', label: '디지털 시대' }
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ padding: 3 }} className="admin-container">
      <Box className="admin-header">
        <Typography variant="h4" className="admin-title">
          <LectureIcon sx={{ mr: 2 }} /> 강의 관리
        </Typography>
        <Typography variant="subtitle1" className="admin-subtitle">
          강의를 추가, 수정, 삭제할 수 있습니다.
        </Typography>
      </Box>
      

      
      <Box sx={{ marginBottom: 2 }}>
      <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
        onClick={showAddModal}
          className="admin-button admin-button-primary"
      >
        새 강의 추가
      </Button>
      </Box>
      
      <TableContainer component={Paper} className="admin-table-container">
        <Table className="admin-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>저자</TableCell>
              <TableCell>카테고리</TableCell>
              <TableCell align="center">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  등록된 강의가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              lectures.map((lecture) => (
                <TableRow key={lecture.id}>
                  <TableCell>{lecture.id}</TableCell>
                  <TableCell>{lecture.title}</TableCell>
                  <TableCell>{lecture.author}</TableCell>
                  <TableCell>{lecture.category}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        onClick={() => showEditModal(lecture)}
                        className="admin-action-icon"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(lecture.id)}
                        className="admin-action-icon"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        component={Link}
                        to={`/admin/lectures/${lecture.id}/contents`}
                        className="admin-action-icon"
                      >
                        <ListIcon />
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
          {editingLecture ? '강의 수정' : '새 강의 추가'}
        </DialogTitle>
        <DialogContent>
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
          
            <TextField
            name="author"
            label="저자"
              fullWidth
              value={formData.author}
              onChange={handleInputChange}
              error={!!formErrors.author}
              helperText={formErrors.author}
              className="admin-form-field"
            />
          
            <FormControl fullWidth error={!!formErrors.category} className="admin-form-field">
              <InputLabel id="category-label">카테고리</InputLabel>
              <Select
                labelId="category-label"
            name="category"
                value={formData.category}
            label="카테고리"
                onChange={handleSelectChange}
          >
              {categoryOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
              {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
            </FormControl>
          
            <TextField
            name="description"
            label="강의 설명"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              className="admin-form-field"
            />
          
            <TextField
            name="thumbnail"
            label="썸네일 URL"
              fullWidth
              value={formData.thumbnail}
              onChange={handleInputChange}
              error={!!formErrors.thumbnail}
              helperText={formErrors.thumbnail}
              className="admin-form-field"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} className="admin-button admin-button-secondary">취소</Button>
          <Button onClick={handleSave} variant="contained" className="admin-button admin-button-primary">저장</Button>
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

export default LectureManagement; 