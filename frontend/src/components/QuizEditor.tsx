import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AlertTitle,
  Alert,
  Snackbar
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

interface Question {
  id: number;
  type: 'objective' | 'subjective';
  question: string;
  choices?: string[];
  answer: string;
}

interface QuizEditorProps {
  lectureId: number;
  contentId?: number;
  examId?: string;
  onSave: (examId: string) => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ lectureId, contentId, examId, onSave }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [examInfo, setExamInfo] = useState({
    title: '',
    description: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [nextQuestionId, setNextQuestionId] = useState<number>(1);

  // 시험 데이터 로드
  useEffect(() => {
    if (examId) {
      loadExamData(examId);
    } else {
      // 새 문제 템플릿 초기화
      setQuestions([createDefaultQuestion()]);
    }
  }, [examId]);

  const loadExamData = async (id: string) => {
    setLoading(true);
    console.log('퀴즈 데이터 로드 시도:', id);
    
    try {
      // URL이나 경로에서 실제 ID만 추출하는 로직 개선
      let cleanId;
      
      if (id) {
        // 가능한 경우의 수 처리:
        // 1. "quiz/123" 형태인 경우
        // 2. "//quiz/123" 형태인 경우 (중복 슬래시)
        // 3. 그냥 숫자나 ID 문자열인 경우
        
        // 먼저 앞뒤 공백 제거
        const trimmedId = id.trim();
        
        // 여러 슬래시가 연속으로 있는 경우 하나로 정규화
        const normalizedId = trimmedId.replace(/\/+/g, '/');
        
        if (normalizedId.includes('quiz/')) {
          // "quiz/숫자" 패턴에서 숫자 부분만 추출
          const parts = normalizedId.split('quiz/');
          cleanId = parts[parts.length - 1]; // 마지막 부분 사용
        } else if (normalizedId.includes('/')) {
          // 다른 형태의 경로에서 마지막 세그먼트 추출
          const parts = normalizedId.split('/');
          cleanId = parts[parts.length - 1]; // 마지막 부분 사용
        } else {
          // 단순 ID인 경우 그대로 사용
          cleanId = normalizedId;
        }
        
        // 숫자 ID가 가능한 경우 숫자로 변환
        cleanId = !isNaN(Number(cleanId)) ? Number(cleanId) : cleanId;
      } else {
        throw new Error('유효한 ID가 제공되지 않았습니다');
      }
      
      console.log('정제된 퀴즈 ID:', cleanId, '타입:', typeof cleanId);
      
      const response = await axios.get(`/api/admins/exams/${cleanId}`);
      console.log('퀴즈 데이터 응답:', response.data);

      const examData = response.data;
      
      // 응답 데이터가 없거나 오류 메시지가 포함된 경우 처리
      if (!examData || examData.error) {
        console.error('퀴즈 데이터 오류:', examData.error || '데이터 없음');
        setSnackbar({
          open: true,
          message: `데이터를 불러오는데 실패했습니다: ${examData.error || '알 수 없는 오류'}`,
          severity: 'error',
        });
        setQuestions([createDefaultQuestion()]);
        setLoading(false);
        return;
      }
      
      setExamInfo({
        title: examData.title || '',
        description: examData.description || '',
      });
      
      if (examData.question) {
        try {
          console.log('JSON 파싱 시도:', examData.question);
          
          // 이미 객체인 경우 파싱하지 않음
          let parsedQuestions;
          if (typeof examData.question === 'string') {
            parsedQuestions = JSON.parse(examData.question);
          } else if (typeof examData.question === 'object') {
            parsedQuestions = examData.question;
          } else {
            throw new Error('지원되지 않는 question 형식');
          }
          
          console.log('파싱된 문제:', parsedQuestions);
          
          if (Array.isArray(parsedQuestions)) {
            // 배열이면 그대로 사용하되, ID 값 최대값을 찾아 nextQuestionId 설정
            const questions = parsedQuestions;
            // 최대 ID 찾기
            let maxId = 0;
            questions.forEach(q => {
              if (q.id > maxId) maxId = q.id;
            });
            
            // nextQuestionId는 최대 ID + 1
            setNextQuestionId(maxId + 1);
            
            setQuestions(questions);
          } else if (parsedQuestions && typeof parsedQuestions === 'object') {
            // 객체면 배열로 변환 시도
            const questionsArray = Object.values(parsedQuestions) as Question[];
            
            if (Array.isArray(questionsArray) && questionsArray.length > 0) {
              // 최대 ID 찾기
              let maxId = 0;
              questionsArray.forEach(q => {
                if (q.id > maxId) maxId = q.id;
              });
              
              // nextQuestionId는 최대 ID + 1
              setNextQuestionId(maxId + 1);
              
              setQuestions(questionsArray);
            } else {
              setQuestions([createDefaultQuestion()]);
            }
          } else {
            // 그 외 케이스는 기본 문제 사용
            setQuestions([createDefaultQuestion()]);
          }
        } catch (e) {
          console.error('문제 JSON 파싱 오류:', e);
          setSnackbar({
            open: true,
            message: '문제 데이터 형식이 잘못되었습니다.',
            severity: 'error',
          });
          setQuestions([createDefaultQuestion()]);
        }
      } else {
        console.log('문제 데이터가 없습니다. 기본 문제 템플릿을 사용합니다.');
        setQuestions([createDefaultQuestion()]);
      }
    } catch (error: any) {
      console.error('퀴즈 데이터 로드 오류:', error);
      console.error('상태 코드:', error.response?.status);
      console.error('오류 데이터:', error.response?.data);
      
      setSnackbar({
        open: true,
        message: `시험 데이터를 불러오는데 실패했습니다: ${error.response?.data?.error || error.message || '알 수 없는 오류'}`,
        severity: 'error',
      });
      setQuestions([createDefaultQuestion()]);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultQuestion = (): Question => {
    // 현재 순차 ID를 사용하고 다음 ID로 카운터 증가
    const currentId = nextQuestionId;
    setNextQuestionId(prevId => prevId + 1);
    
    return {
      id: currentId,
      type: 'objective',
      question: '',
      choices: ['', '', '', ''],
      answer: '',
    };
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, createDefaultQuestion()]);
  };

  const handleDeleteQuestion = (id: number) => {
    if (questions.length <= 1) {
      setSnackbar({
        open: true,
        message: '최소 1개의 문제가 필요합니다.',
        severity: 'error',
      });
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentQuestion(null);
  };

  const handleQuestionChange = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
    setModalOpen(false);
    setCurrentQuestion(null);
  };

  const handleQuestionTypeChange = (id: number, e: SelectChangeEvent) => {
    const type = e.target.value as 'objective' | 'subjective';
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          type,
          choices: type === 'objective' ? (q.choices || ['', '', '', '']) : undefined,
        };
      }
      return q;
    }));
  };

  const handleExamInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExamInfo({ ...examInfo, [name]: value });
  };

  const saveQuiz = async () => {
    if (questions.some(q => !q.question || (q.type === 'objective' && (!q.choices || q.choices.some(c => !c))) || !q.answer)) {
      setSnackbar({
        open: true,
        message: '모든 필드를 입력해주세요.',
        severity: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      // 문제가 없는 경우 기본 문제 하나 추가
      const questionData = questions.length > 0 
        ? JSON.stringify(questions)
        : JSON.stringify([createDefaultQuestion()]);

      const requestData = {
        lectureId,
        title: examInfo.title || '퀴즈',
        description: examInfo.description || '컨텐츠 관리에서 생성된 퀴즈입니다.',
        question: questionData,
        startTime: null,
        endTime: null
      };

      // question이 비어있지 않은지 확인
      console.log('저장할 퀴즈 데이터:', requestData);
      console.log('문제 데이터 길이:', requestData.question.length);

      let response;
      if (examId) {
        // 기존 exam 업데이트
        // URL에서 실제 ID만 추출하는 로직 개선
        let cleanId;
        
        if (examId) {
          // 가능한 경우의 수 처리:
          // 1. "quiz/123" 형태인 경우
          // 2. "//quiz/123" 형태인 경우 (중복 슬래시)
          // 3. 그냥 숫자나 ID 문자열인 경우
          
          // 먼저 앞뒤 공백 제거
          const trimmedId = examId.trim();
          
          // 여러 슬래시가 연속으로 있는 경우 하나로 정규화
          const normalizedId = trimmedId.replace(/\/+/g, '/');
          
          if (normalizedId.includes('quiz/')) {
            // "quiz/숫자" 패턴에서 숫자 부분만 추출
            const parts = normalizedId.split('quiz/');
            cleanId = parts[parts.length - 1]; // 마지막 부분 사용
          } else if (normalizedId.includes('/')) {
            // 다른 형태의 경로에서 마지막 세그먼트 추출
            const parts = normalizedId.split('/');
            cleanId = parts[parts.length - 1]; // 마지막 부분 사용
          } else {
            // 단순 ID인 경우 그대로 사용
            cleanId = normalizedId;
          }
          
          // 숫자 ID가 가능한 경우 숫자로 변환
          cleanId = !isNaN(Number(cleanId)) ? Number(cleanId) : cleanId;
        } else {
          throw new Error('유효한 ID가 제공되지 않았습니다');
        }
        
        console.log('퀴즈 업데이트 정제된 ID:', cleanId, '타입:', typeof cleanId);
        
        response = await axios.put(`/api/admins/exams/${cleanId}`, requestData);
        setSnackbar({
          open: true,
          message: '퀴즈가 성공적으로 업데이트되었습니다.',
          severity: 'success',
        });
        onSave(examId);
      } else {
        // 새 exam 생성
        response = await axios.post('/api/admins/exams', requestData);
        console.log('새 퀴즈 생성 응답:', response.data);
        
        // 수정된 부분: response.data가 직접 ID를 반환하는 경우를 처리
        const newExamId = response.data.id ? response.data.id.toString() : response.data.toString();
        
        setSnackbar({
          open: true,
          message: '새 퀴즈가 성공적으로 생성되었습니다.',
          severity: 'success',
        });
        onSave(newExamId);
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      setSnackbar({
        open: true,
        message: '퀴즈 저장에 실패했습니다.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <Box sx={{ p: 2 }}>퀴즈 데이터를 불러오는 중...</Box>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>퀴즈 편집기</Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <TextField
            fullWidth
            label="퀴즈 제목"
            name="title"
            value={examInfo.title}
            onChange={handleExamInfoChange}
            variant="outlined"
            placeholder="퀴즈 제목을 입력하세요"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <TextField
            fullWidth
            label="퀴즈 설명"
            name="description"
            value={examInfo.description}
            onChange={handleExamInfoChange}
            variant="outlined"
            placeholder="퀴즈에 대한 간략한 설명을 입력하세요"
          />
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddQuestion}
          sx={{ mr: 1 }}
        >
          문제 추가
        </Button>
        
        <Button 
          variant="contained" 
          color="success"
          startIcon={<SaveIcon />} 
          onClick={saveQuiz}
          disabled={saving}
        >
          {saving ? '저장 중...' : '퀴즈 저장'}
        </Button>
      </Box>
      
      {questions.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>문제가 없습니다</AlertTitle>
          새 문제를 추가해주세요.
        </Alert>
      ) : (
        <Box>
          {questions.map((question, index) => (
            <Card key={question.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">문제 #{index + 1}</Typography>
                  <Box>
                    <Button
                      size="small"
                      onClick={() => handleEditQuestion(question)}
                      sx={{ mr: 1 }}
                    >
                      수정
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>문제 유형</InputLabel>
                    <Select
                      value={question.type}
                      label="문제 유형"
                      onChange={(e) => handleQuestionTypeChange(question.id, e)}
                    >
                      <MenuItem value="objective">객관식</MenuItem>
                      <MenuItem value="subjective">주관식</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {question.question || '(문제가 입력되지 않았습니다)'}
                </Typography>
                
                {question.type === 'objective' && question.choices && (
                  <Box sx={{ pl: 2 }}>
                    {question.choices.map((choice, choiceIndex) => (
                      <Box key={choiceIndex} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: choice === question.answer ? 'bold' : 'normal',
                          color: choice === question.answer ? 'green' : 'inherit',
                        }}>
                          {String.fromCharCode(65 + choiceIndex)}. {choice || '(선택지가 입력되지 않았습니다)'}
                          {choice === question.answer && ' ✓'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                
                {question.type === 'subjective' && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>정답:</strong> {question.answer || '(정답이 입력되지 않았습니다)'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      
      {/* 문제 편집 모달 */}
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="md">
        <DialogTitle>문제 편집</DialogTitle>
        <DialogContent>
          {currentQuestion && (
            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>문제 유형</InputLabel>
                <Select
                  value={currentQuestion.type}
                  label="문제 유형"
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    type: e.target.value as 'objective' | 'subjective',
                    choices: e.target.value === 'objective' ? (currentQuestion.choices || ['', '', '', '']) : undefined,
                  })}
                >
                  <MenuItem value="objective">객관식</MenuItem>
                  <MenuItem value="subjective">주관식</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="문제"
                multiline
                rows={2}
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              {currentQuestion.type === 'objective' && currentQuestion.choices && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>보기 입력</Typography>
                  {currentQuestion.choices.map((choice, i) => (
                    <Box key={i} sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
                      <Typography sx={{ mr: 1, width: 20 }}>{String.fromCharCode(65 + i)}.</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={choice}
                        onChange={(e) => {
                          const newChoices = [...currentQuestion.choices!];
                          newChoices[i] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, choices: newChoices });
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => setCurrentQuestion({ 
                          ...currentQuestion, 
                          answer: currentQuestion.choices![i] 
                        })}
                        variant={currentQuestion.answer === currentQuestion.choices![i] ? 'contained' : 'outlined'}
                        color="primary"
                        sx={{ ml: 1, minWidth: 80 }}
                      >
                        {currentQuestion.answer === currentQuestion.choices![i] ? '정답' : '정답 설정'}
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
              
              {currentQuestion.type === 'subjective' && (
                <TextField
                  fullWidth
                  label="정답"
                  multiline
                  rows={2}
                  value={currentQuestion.answer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
                  sx={{ mb: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>취소</Button>
          <Button 
            onClick={() => currentQuestion && handleQuestionChange(currentQuestion)} 
            variant="contained"
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default QuizEditor; 