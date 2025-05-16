import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Divider, Button, Stack } from '@mui/material';
import { useEffect } from 'react';

interface QuestionResult {
    questionId: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean | string;
}

interface ScoreResult {
    examId: number;
    userId: number;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    passed: boolean;
    examTitle?: string;
    questionResults?: QuestionResult[];
    lectureId?: number;
}

const ResultReportPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state as ScoreResult;

    useEffect(() => {
        console.log("📦 채점 결과 전체 확인:", result);
        result?.questionResults?.forEach((q, idx) => {
            console.log(`🔍 Q${idx + 1}`, q);
        });
    }, [result]);

    const getPassStatus = (score: number): string => {
        return score >= 50 ? '합격' : '불합격';
    };

    const today = new Date().toLocaleDateString('ko-KR');

    const renderRow = (label: string, value: string) => (
        <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>{label}</Typography>
            <Typography>{value}</Typography>
        </Box>
    );

    const isActuallyCorrect = (value: boolean | string): boolean =>
        value === true || value === 'true';

    const scoreText =
        typeof result?.score === 'number' ? `${result.score.toFixed(2)}점` : '점수 없음';
    const statusText =
        typeof result?.score === 'number' ? getPassStatus(result.score) : '미채점';

    return (
        <Box sx={{ mt: 12, mb:12, display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ width: 700, p: 4, boxShadow: 4, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    📚 성적표
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {renderRow('시험 제목', result.examTitle || '제목 없음')}
                {renderRow('응시일', today)}

                <Divider sx={{ my: 2 }} />

                {renderRow('총 문항 수', `${result.totalQuestions ?? 0}문제`)}
                {renderRow('정답 개수', `${result.correctAnswers ?? 0}개`)}
                {renderRow('점수', scoreText)}
                {renderRow('결과', statusText)}

                <Divider sx={{ mt: 3, mb: 2 }} />

                {result.questionResults?.map((q, idx) => {
                    const correct = isActuallyCorrect(q.isCorrect ?? (q as any).correct);
                    return (
                        <Box key={idx} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Q{q.questionId}. {q.question}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: correct ? 'green' : 'red', mt: 0.5 }}
                            >
                                📝 내가 쓴 답: {q.userAnswer || '미응답'} {correct ? '✅ 정답' : '❌ 오답'}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                ✅ 정답: {q.correctAnswer}
                            </Typography>

                            {!correct && q.correctAnswer.includes(',') && (
                                <Typography variant="caption" color="text.secondary">
                                    ✔ 부분 점수 부여 가능
                                </Typography>
                            )}

                            <Divider sx={{ mt: 1, mb: 2 }} />
                        </Box>
                    );
                })}

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="contained" onClick={() => navigate(-1)} style={{backgroundColor: '#028267'}}>다시 풀기</Button>
                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(`/lectures/${result.lectureId || 1}`)
                        }
                        style={{borderColor: '#028267', color: '#028267'}}
                    >
                        강의 상세로
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ResultReportPage;
