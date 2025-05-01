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
    totalQuestions: number;
    correctCount: number;
    score: number;
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
        result.questionResults?.forEach((q, idx) => {
            console.log(`🔍 Q${idx + 1}`, q);
        });
    }, [result]);

    const getGrade = (score: number): string => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
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

    return (
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ width: 700, p: 4, boxShadow: 4, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    📚 성적표
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {renderRow('시험 제목', `${result.examTitle}`)}
                {renderRow('응시일', today)}

                <Divider sx={{ my: 2 }} />

                {renderRow('총 문항 수', `${result.totalQuestions}문제`)}
                {renderRow('정답 개수', `${result.correctCount}개`)}
                {renderRow('점수', `${result.score.toFixed(2)}점`)}
                {renderRow('등급', getGrade(result.score))}

                <Divider sx={{ mt: 3, mb: 2 }} />

                {result.questionResults?.map((q, idx) => {
                    const correct = isActuallyCorrect(q.isCorrect ?? (q as any).correct);
                    return (
                        <Box key={idx} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">
                                Q{q.questionId}. {q.question}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: correct ? 'green' : 'red' }}
                            >
                                📝 내가 쓴 답: {q.userAnswer || '미응답'} {correct ? '✅' : '❌'}
                            </Typography>
                            <Typography variant="body2">
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
                    <Button variant="contained" onClick={() => navigate(-1)}>다시 풀기</Button>
                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(`/lectures/${result.lectureId || 1}`)
                        }
                    >
                        강의 상세로
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ResultReportPage;
