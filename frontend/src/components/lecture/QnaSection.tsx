import React from 'react';
import './QnaSection.css';
import { LectureQna, NewQuestion } from '../../utils/LectureDetailUtils';

interface QnaSectionProps {
    qnas: LectureQna[];
    selectedQna: LectureQna | null;
    newQuestion: NewQuestion;
    answer: string;
    isAskingQuestion: boolean;
    isAnswering: boolean;
    userIsAdmin: boolean;
    onQnaClick: (qna: LectureQna) => void;
    onAnswerClick: (qna: LectureQna) => void;
    onAskQuestionClick: () => void;
    onCancelQuestion: () => void;
    onCancelAnswer: () => void;
    onAskQuestion: () => void;
    onSubmitAnswer: () => void;
    onDeleteQna: (qnaId: number) => void;
    setNewQuestion: (question: NewQuestion) => void;
    setAnswer: (answer: string) => void;
    getCurrentUser: () => string;
}

const QnaSection: React.FC<QnaSectionProps> = ({
    qnas,
    selectedQna,
    newQuestion,
    answer,
    isAskingQuestion,
    isAnswering,
    userIsAdmin,
    onQnaClick,
    onAnswerClick,
    onAskQuestionClick,
    onCancelQuestion,
    onCancelAnswer,
    onAskQuestion,
    onSubmitAnswer,
    onDeleteQna,
    setNewQuestion,
    setAnswer,
    getCurrentUser
}) => {
    return (
        <section id="lectureQna" className="qna-section">
            <div className="qna-header">
                <h2 className="section-title">
                    ❓ 질문 & 답변
                </h2>
                {!isAskingQuestion && !isAnswering && (
                    <button onClick={onAskQuestionClick} className="notice-write-btn">
                        질문하기
                    </button>
                )}
            </div>

            {isAskingQuestion ? (
                <div className="qna-form">
                    <h3>새 질문 작성</h3>
                    <textarea
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        placeholder="질문 내용을 입력하세요"
                        className="qna-textarea"
                    />
                    <div className="qna-form-buttons">
                        <button onClick={onCancelQuestion} className="qna-cancel-btn">취소</button>
                        <button onClick={onAskQuestion} className="qna-submit-btn">질문하기</button>
                    </div>
                </div>
            ) : isAnswering && selectedQna ? (
                <div className="qna-form">
                    <h3>답변 작성</h3>
                    <div className="qna-question">
                        <div className="qna-question-header">
                            <span className="qna-question-author">{selectedQna.author}</span>
                            <span className="qna-question-date">{new Date(selectedQna.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="qna-question-content">{selectedQna.question}</p>
                    </div>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="답변 내용을 입력하세요"
                        className="qna-textarea"
                    />
                    <div className="qna-form-buttons">
                        <button onClick={onCancelAnswer} className="qna-cancel-btn">취소</button>
                        <button onClick={onSubmitAnswer} className="qna-submit-btn">답변하기</button>
                    </div>
                </div>
            ) : (
                <>
                    {qnas.length === 0 ? (
                        <p className="qna-empty">등록된 질문이 없습니다.</p>
                    ) : (
                        <ul className="qna-list">
                            {qnas.map((qna) => (
                                <li key={qna.id} className="qna-item">
                                    <div className="qna-question">
                                        <div className="qna-question-header">
                                            <span className="qna-question-author">{qna.author}</span>
                                            <span className="qna-question-date">{new Date(qna.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="qna-question-content">{qna.question}</p>
                                        <div className="qna-action-buttons">
                                            {userIsAdmin && !qna.answer && (
                                                <button 
                                                    onClick={() => onAnswerClick(qna)}
                                                    className="qna-answer-btn"
                                                >
                                                    답변하기
                                                </button>
                                            )}
                                            {(userIsAdmin || qna.author === getCurrentUser()) && (
                                                <button 
                                                    onClick={() => onDeleteQna(qna.id)}
                                                    className="qna-delete-btn"
                                                >
                                                    삭제
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {qna.answer && (
                                        <div className="qna-answer">
                                            <div className="qna-answer-header">
                                                <span className="qna-answer-label">답변</span>
                                                <span className="qna-answer-date">
                                                    {qna.answeredAt && new Date(qna.answeredAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="qna-answer-content">
                                                {(() => {
                                                    if (!qna.answer) return '';
                                                    
                                                    try {
                                                        if (typeof qna.answer === 'string' && qna.answer.trim().startsWith('{')) {
                                                            const parsed = JSON.parse(qna.answer);
                                                            return parsed.answer || qna.answer;
                                                        }
                                                        return qna.answer;
                                                    } catch (e) {
                                                        return qna.answer;
                                                    }
                                                })()}
                                            </p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </section>
    );
};

export default QnaSection; 