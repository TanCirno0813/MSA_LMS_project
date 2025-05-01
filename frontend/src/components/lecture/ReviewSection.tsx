import React from 'react';
import { Link } from 'react-router-dom';
import { LectureReview, NewReview } from '../../utils/LectureDetailUtils';

interface ReviewSectionProps {
    reviews: LectureReview[];
    selectedReview: LectureReview | null;
    newReview: NewReview;
    isWritingReview: boolean;
    isEditingReview: boolean;
    userIsAdmin: boolean;
    onReviewClick: (review: LectureReview) => void;
    onWriteReviewClick: () => void;
    onEditReviewClick: () => void;
    onDeleteReview: (reviewId: number) => void;
    onCancelReview: () => void;
    onCreateReview: () => void;
    onUpdateReview: () => void;
    setNewReview: (review: NewReview) => void;
    isLoggedIn: () => boolean;
    getCurrentUser: () => string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
    reviews,
    selectedReview,
    newReview,
    isWritingReview,
    isEditingReview,
    userIsAdmin,
    onReviewClick,
    onWriteReviewClick,
    onEditReviewClick,
    onDeleteReview,
    onCancelReview,
    onCreateReview,
    onUpdateReview,
    setNewReview,
    isLoggedIn,
    getCurrentUser
}) => {
    return (
        <section id="lectureReviews" className="review-section">
            <div className="review-header">
                <h2 className="section-title">
                    ⭐ 수강생 리뷰
                </h2>
                {!isWritingReview && !isEditingReview && (
                    isLoggedIn() ? (
                        <button onClick={onWriteReviewClick} className="review-write-btn">
                            리뷰 작성
                        </button>
                    ) : (
                        <Link to="/login" className="review-login-btn">
                            로그인하고 리뷰 작성
                        </Link>
                    )
                )}
            </div>

            {isWritingReview ? (
                <div className="review-form">
                    <h3>새 리뷰 작성</h3>
                    <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        placeholder="제목을 입력하세요"
                        className="review-input"
                    />
                    <textarea
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        placeholder="내용을 입력하세요"
                        className="review-textarea"
                    />
                    <div className="review-form-buttons">
                        <button onClick={onCancelReview} className="review-cancel-btn">취소</button>
                        <button onClick={onCreateReview} className="review-submit-btn">작성하기</button>
                    </div>
                </div>
            ) : isEditingReview && selectedReview ? (
                <div className="review-form">
                    <h3>리뷰 수정</h3>
                    <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        placeholder="제목을 입력하세요"
                        className="review-input"
                    />
                    <textarea
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        placeholder="내용을 입력하세요"
                        className="review-textarea"
                    />
                    <div className="review-form-buttons">
                        <button onClick={onCancelReview} className="review-cancel-btn">취소</button>
                        <button onClick={onUpdateReview} className="review-submit-btn">수정하기</button>
                    </div>
                </div>
            ) : selectedReview ? (
                <div className="review-detail">
                    <h3 className="review-title">{selectedReview.title}</h3>
                    <p className="review-meta">
                        <span>작성자: {selectedReview.author}</span>
                        <span>{new Date(selectedReview.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p className="review-content">{selectedReview.content}</p>
                    <div className="review-action-buttons">
                        <button 
                            onClick={() => onReviewClick(null)} 
                            className="review-write-btn"
                        >
                            목록으로
                        </button>
                        
                        {(userIsAdmin || selectedReview.author === getCurrentUser()) && (
                            <>
                                <button 
                                    onClick={onEditReviewClick}
                                    className="review-edit-btn"
                                >
                                    수정
                                </button>
                                <button 
                                    onClick={() => onDeleteReview(selectedReview.id)}
                                    className="review-delete-btn"
                                >
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {reviews.length === 0 ? (
                        <p className="review-empty">등록된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
                    ) : (
                        <ul className="review-list">
                            {reviews.map((review) => (
                                <li key={review.id} className="review-item" onClick={() => onReviewClick(review)}>
                                    <div className="review-card">
                                        <h3 className="review-card-title">{review.title}</h3>
                                        <p className="review-card-content">{review.content.length > 100 
                                            ? `${review.content.substring(0, 100)}...` 
                                            : review.content}
                                        </p>
                                        <div className="review-card-footer">
                                            <span className="review-card-author">{review.author}</span>
                                            <span className="review-card-date">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </section>
    );
};

export default ReviewSection; 