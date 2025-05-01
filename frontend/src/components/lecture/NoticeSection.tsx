import React from 'react';
import { Notice, NewNotice } from '../../utils/LectureDetailUtils';

interface NoticeSectionProps {
    notices: Notice[];
    selectedNotice: Notice | null;
    newNotice: NewNotice;
    isWriting: boolean;
    isEditing: boolean;
    userIsAdmin: boolean;
    onNoticeClick: (notice: Notice) => void;
    onWriteClick: () => void;
    onEditClick: () => void;
    onDeleteNotice: (noticeId: number) => void;
    onCancelWrite: () => void;
    onCreateNotice: () => void;
    onUpdateNotice: () => void;
    setNewNotice: (notice: NewNotice) => void;
}

const NoticeSection: React.FC<NoticeSectionProps> = ({
    notices,
    selectedNotice,
    newNotice,
    isWriting,
    isEditing,
    userIsAdmin,
    onNoticeClick,
    onWriteClick,
    onEditClick,
    onDeleteNotice,
    onCancelWrite,
    onCreateNotice,
    onUpdateNotice,
    setNewNotice
}) => {
    return (
        <section id="lectureNotice" className="notice-section">
            <div className="notice-header">
                <h2 className="section-title">
                    📢 강의 공지사항
                </h2>
                {!isWriting && !isEditing && userIsAdmin && (
                    <button onClick={onWriteClick} className="notice-write-btn">
                        공지사항 작성
                    </button>
                )}
            </div>

            {isWriting ? (
                <div className="notice-form">
                    <h3>새 공지사항 작성</h3>
                    <input
                        type="text"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        placeholder="제목을 입력하세요"
                        className="notice-input"
                    />
                    <textarea
                        value={newNotice.content}
                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                        placeholder="내용을 입력하세요"
                        className="notice-textarea"
                    />
                    <div className="notice-form-buttons">
                        <button onClick={onCancelWrite} className="notice-cancel-btn">취소</button>
                        <button onClick={onCreateNotice} className="notice-submit-btn">작성하기</button>
                    </div>
                </div>
            ) : isEditing && selectedNotice ? (
                <div className="notice-form">
                    <h3>공지사항 수정</h3>
                    <input
                        type="text"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        placeholder="제목을 입력하세요"
                        className="notice-input"
                    />
                    <textarea
                        value={newNotice.content}
                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                        placeholder="내용을 입력하세요"
                        className="notice-textarea"
                    />
                    <div className="notice-form-buttons">
                        <button onClick={onCancelWrite} className="notice-cancel-btn">취소</button>
                        <button onClick={onUpdateNotice} className="notice-submit-btn">수정하기</button>
                    </div>
                </div>
            ) : selectedNotice ? (
                <div className="notice-detail">
                    <h3 className="notice-title">{selectedNotice.title}</h3>
                    <p className="notice-meta">
                        <span>작성자: {selectedNotice.author}</span>
                        <span>{new Date(selectedNotice.createdAt).toLocaleDateString()}</span>
                        <span>조회수: {selectedNotice.views}</span>
                    </p>
                    <p className="notice-content">{selectedNotice.content}</p>
                    <div className="notice-action-buttons">
                        <button 
                            onClick={() => onNoticeClick(null)} 
                            className="notice-write-btn"
                        >
                            목록으로
                        </button>
                        
                        {userIsAdmin && (
                            <>
                                <button 
                                    onClick={onEditClick}
                                    className="notice-edit-btn"
                                >
                                    수정
                                </button>
                                <button 
                                    onClick={() => onDeleteNotice(selectedNotice.id)}
                                    className="notice-delete-btn-1"
                                >
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {notices.length === 0 ? (
                        <p className="notice-empty">등록된 공지사항이 없습니다.</p>
                    ) : (
                        <table className="notice-table">
                            <thead>
                                <tr>
                                    <th className="notice-number">번호</th>
                                    <th>제목</th>
                                    <th className="notice-author">작성자</th>
                                    <th className="notice-date">작성일</th>
                                    <th className="notice-views">조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.map((notice, index) => (
                                    <tr key={notice.id} onClick={() => onNoticeClick(notice)} style={{ cursor: 'pointer' }}>
                                        <td className="notice-number">{notices.length - index}</td>
                                        <td>{notice.title}</td>
                                        <td className="notice-author">{notice.author}</td>
                                        <td className="notice-date">{new Date(notice.createdAt).toLocaleDateString()}</td>
                                        <td className="notice-views">{notice.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </section>
    );
};

export default NoticeSection; 