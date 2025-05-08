import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';

// 수강 신청 데이터 타입 정의
interface Enrollment {
  id: number;
  lectureId: number;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  approvedAt: string | null;
  lectureTitle?: string; // 강의 제목 필드 추가
}

// 강의 데이터 타입 정의
interface Lecture {
  id: number;
  title: string;
  // 다른 강의 관련 필드들...
}

const EnrollmentManagement: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [lectures, setLectures] = useState<Record<number, string>>({});

  // 모든 수강 신청 목록 불러오기
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        // AdminEnrollmentController의 경로에 맞게 수정
        const response = await fetch('/api/admins/enrollments');
        
        if (!response.ok) {
          throw new Error(`수강 신청 목록을 불러오는데 실패했습니다. 상태 코드: ${response.status}`);
        }
        
        // 응답 ContentType 확인
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`API에서 예상치 못한 응답 형식을 반환했습니다: ${contentType}`);
        }
        
        const data = await response.json();
        setEnrollments(data);

        // 강의 ID 목록 추출
        const lectureIds = [...new Set(data.map((item: Enrollment) => item.lectureId))].filter(id => typeof id === 'number') as number[];
        
        // 각 강의 정보 가져오기
        await fetchLectureTitles(lectureIds);
      } catch (error) {
        console.error('수강 신청 목록 불러오기 오류:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // 강의 제목 가져오기
  const fetchLectureTitles = async (lectureIds: number[]) => {
    try {
      const lectureMap: Record<number, string> = {};
      
      // 각 강의 정보를 병렬로 가져오기
      await Promise.all(lectureIds.map(async (id) => {
        try {
          const response = await fetch(`/api/lectures/${id}`);
          if (response.ok) {
            const lecture = await response.json();
            lectureMap[id] = lecture.title;
          } else {
            lectureMap[id] = `강의 ${id}`;
          }
        } catch (error) {
          console.error(`강의 ${id} 정보 가져오기 실패:`, error);
          lectureMap[id] = `강의 ${id}`;
        }
      }));
      
      setLectures(lectureMap);
      
      // 기존 enrollments에 강의 제목 추가
      setEnrollments(prev => prev.map(enrollment => ({
        ...enrollment,
        lectureTitle: lectureMap[enrollment.lectureId] || `강의 ${enrollment.lectureId}`
      })));
    } catch (error) {
      console.error('강의 정보 가져오기 오류:', error);
    }
  };

  // 수강 신청 승인 처리
  const handleApprove = async (id: number) => {
    try {
      // AdminEnrollmentController의 경로에 맞게 수정
      const response = await fetch(`/api/admins/enrollments/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`수강 신청 승인에 실패했습니다. 상태 코드: ${response.status}`);
      }

      // 승인 후 목록 업데이트
      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === id ? { ...enrollment, status: 'APPROVED' } : enrollment
      ));
      
      setOpenDialog(false);
    } catch (error) {
      console.error('수강 신청 승인 오류:', error);
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 수강 신청 거절 처리
  const handleReject = async (id: number) => {
    try {
      // AdminEnrollmentController의 경로에 맞게 수정
      const response = await fetch(`/api/admins/enrollments/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`수강 신청 거절에 실패했습니다. 상태 코드: ${response.status}`);
      }

      // 거절 후 목록 업데이트
      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === id ? { ...enrollment, status: 'REJECTED' } : enrollment
      ));
      
      setOpenDialog(false);
    } catch (error) {
      console.error('수강 신청 거절 오류:', error);
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 모달 열기
  const openConfirmDialog = (enrollment: Enrollment, action: 'approve' | 'reject') => {
    setSelectedEnrollment(enrollment);
    setActionType(action);
    setOpenDialog(true);
  };

  // 상태에 따른 스타일 및 텍스트
  const getStatusChip = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <Chip label="대기 중" color="warning" />;
      case 'APPROVED':
        return <Chip label="승인됨" color="success" />;
      case 'REJECTED':
        return <Chip label="거절됨" color="error" />;
      default:
        return <Chip label="알 수 없음" />;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box className="admin-header" sx={{ mb: 4 }}>
        <Typography variant="h4" className="admin-title">
          수강 신청 관리
        </Typography>
        <Typography variant="subtitle1" className="admin-subtitle">
          사용자들의 수강 신청을 승인하거나 거절합니다.
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>신청 ID</TableCell>
              <TableCell>강의명</TableCell>
              <TableCell>사용자 ID</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>신청일</TableCell>
              <TableCell>승인/거절일</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  수강 신청 내역이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.id}</TableCell>
                  <TableCell>{enrollment.lectureTitle || `강의 ${enrollment.lectureId}`}</TableCell>
                  <TableCell>{enrollment.userId}</TableCell>
                  <TableCell>{getStatusChip(enrollment.status)}</TableCell>
                  <TableCell>{formatDate(enrollment.appliedAt)}</TableCell>
                  <TableCell>{formatDate(enrollment.approvedAt)}</TableCell>
                  <TableCell>
                    {enrollment.status === 'PENDING' && (
                      <>
                        <Button 
                          startIcon={<CheckCircleIcon />}
                          color="success" 
                          onClick={() => openConfirmDialog(enrollment, 'approve')}
                          sx={{ mr: 1 }}
                        >
                          승인
                        </Button>
                        <Button 
                          startIcon={<CancelIcon />}
                          color="error" 
                          onClick={() => openConfirmDialog(enrollment, 'reject')}
                        >
                          거절
                        </Button>
                      </>
                    )}
                    {enrollment.status !== 'PENDING' && (
                      <Typography variant="body2" color="textSecondary">
                        처리 완료
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 확인 다이얼로그 */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>
          {actionType === 'approve' ? '수강 신청 승인' : '수강 신청 거절'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedEnrollment && (
              <>
                {actionType === 'approve' 
                  ? `사용자 ${selectedEnrollment.userId}의 강의 "${selectedEnrollment.lectureTitle || `강의 ${selectedEnrollment.lectureId}`}" 수강 신청을 승인하시겠습니까?`
                  : `사용자 ${selectedEnrollment.userId}의 강의 "${selectedEnrollment.lectureTitle || `강의 ${selectedEnrollment.lectureId}`}" 수강 신청을 거절하시겠습니까?`
                }
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            취소
          </Button>
          {selectedEnrollment && (
            <Button 
              onClick={() => actionType === 'approve' 
                ? handleApprove(selectedEnrollment.id) 
                : handleReject(selectedEnrollment.id)
              } 
              color={actionType === 'approve' ? 'success' : 'error'}
              autoFocus
            >
              {actionType === 'approve' ? '승인하기' : '거절하기'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EnrollmentManagement; 