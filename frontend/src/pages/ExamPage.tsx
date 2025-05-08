import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ExamPage.css';

interface Question {
    id: number;
    question: string;
    type: 'objective' | 'subjective';
    choices?: string[];
}

interface Exam {
    id: number;
    lectureId: number;
    title: string;
    description: string;
    question: string;
}

interface AnswersState {
    [key: string]: string;
}

const ExamPage: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<AnswersState>({});
    const navigate = useNavigate();
    const { lectureId } = useParams<{ lectureId: string }>();

    useEffect(() => {
        if (!lectureId) return;
        setLoading(true);
        axios.get(`/api/exams/lecture/${lectureId}`)
            .then(res => {
                setExams(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('시험 목록 로드 실패:', err);
                setError('시험 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    }, [lectureId]);

    const handleAnswerChange = (examId: number, questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [`${examId}_${questionId}`]: value }));
    };

    const handleSubmit = () => {
        if (!exams || exams.length === 0) {
            alert('제출할 시험이 없습니다.');
            return;
        }
        const userId = localStorage.getItem('userId');

        const payload = exams.map(exam => ({
            examId: exam.id,
            userId,
            questionJson: exam.question,
            answers: Object.fromEntries(
                Object.entries(answers).filter(([key]) => key.startsWith(`${exam.id}_`))
            )
        }));

        axios.post('/api/grading/submit', payload)
            .then(res => {
                console.log("✅ 서버 응답:", res.data);

                if (lectureId) {
                    localStorage.setItem(`quizCompleted_${lectureId}_${userId}`, 'true');
                }

                const result = res.data[0];
                result.lectureId = parseInt(lectureId || '1', 10);

                navigate('/result', { state: result });
            })
            .catch(() => alert('채점 실패'));
    };

    const parseQuestions = (json: string): Question[] => {
        if (!json) return [];
        try {
            const parsed = JSON.parse(json);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    if (loading) {
        return <div className="exam-loading">시험 목록을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="exam-error">{error}</div>;
    }

    return (
        <div className="exam-container">
            <h2 className="exam-header">📝 확인 문제</h2>

            {exams && exams.length > 0 ? (
                exams.map(exam => (
                    <div key={exam.id} className="exam-section">
                        <h3 className="exam-title">{exam.title}</h3>
                        <p className="exam-description">{exam.description}</p>
                        {exam.question && parseQuestions(exam.question).map(q => (
                            <div key={q.id} className="exam-question-block">
                                <p className="exam-question"><strong>Q{q.id}.</strong> {q.question}</p>
                                {q.type === 'objective' && q.choices && q.choices.length > 0 ? (
                                    q.choices.map((choice, idx) => (
                                        <label key={idx} className="exam-choice">
                                            <input
                                                type="radio"
                                                name={`${exam.id}_${q.id}`}
                                                value={choice}
                                                onChange={e => handleAnswerChange(exam.id, q.id, e.target.value)}
                                            />{' '}
                                            {choice}
                                        </label>
                                    ))
                                ) : (
                                    <textarea
                                        className="exam-textarea"
                                        rows={3}
                                        value={answers[`${exam.id}_${q.id}`] || ''}
                                        onChange={e => handleAnswerChange(exam.id, q.id, e.target.value)}
                                        placeholder="답변을 입력하세요"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p className="no-exam-message">이 강의에 등록된 시험이 없습니다.</p>
            )}

            {exams && exams.length > 0 && (
                <button onClick={handleSubmit} className="submit-button">
                    답안 제출
                </button>
            )}
        </div>
    );
};

export default ExamPage;
