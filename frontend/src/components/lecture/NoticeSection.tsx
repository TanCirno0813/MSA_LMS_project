import React from 'react';
import './NoticeSection.css';
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
        <section id="lectureNotices" className="notice-section">
            <div className="notice-header">
                <h2 className="section-title">
                    📢 공지사항
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
                    <div className="notice-meta">
                        <span>{new Date(selectedNotice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="notice-content">{selectedNotice.content}</p>
                    <div className="notice-action-buttons">
                        <button 
                            onClick={() => onNoticeClick(null as any)} 
                            className="btn btn-primary"
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
                                    className="notice-delete-btn"
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
                        <ul className="notice-list">
                            {notices.map((notice) => (
                                <li key={notice.id} className="notice-item" onClick={() => onNoticeClick(notice)}>
                                    <div className="notice-title">{notice.title}</div>
                                    <div className="notice-meta">
                                        <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
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

export default NoticeSection; 