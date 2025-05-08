import React from 'react';
import './LectureSidebar.css';

interface LectureSidebarProps {
    lectureId: number;
    notices: any[];
    activeSection: string;
    onSectionChange: (section: string) => void;
    completionRate: number;  // ✅ 이거 추가
}

const LectureSidebar: React.FC<LectureSidebarProps> = ({
    notices,
    activeSection, 
    onSectionChange,
    completionRate // ✅ props 받기
}) => {
    return (
        <div className="lecture-sidebar">
            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    <li className="sidebar-menu-item">
                        <button 
                            className={`sidebar-link ${activeSection === 'contents' ? 'active' : ''}`}
                            onClick={() => onSectionChange('contents')}
                        >
                            <span className="sidebar-icon">📚</span>
                            강의 콘텐츠
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button 
                            className={`sidebar-link ${activeSection === 'notice' ? 'active' : ''}`}
                            onClick={() => onSectionChange('notice')}
                        >
                            <span className="sidebar-icon">📢</span>
                            공지사항
                            {notices.length > 0 && (
                                <span className="notice-count">{notices.length}</span>
                            )}
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button 
                            className={`sidebar-link ${activeSection === 'qna' ? 'active' : ''}`}
                            onClick={() => onSectionChange('qna')}
                        >
                            <span className="sidebar-icon">❓</span>
                            Q&A
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button 
                            className={`sidebar-link ${activeSection === 'reviews' ? 'active' : ''}`}
                            onClick={() => onSectionChange('reviews')}
                        >
                            <span className="sidebar-icon">⭐</span>
                            수강생 리뷰
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button 
                            className={`sidebar-link ${activeSection === 'progress' ? 'active' : ''}`}
                            onClick={() => onSectionChange('progress')}
                        >
                            <span className="sidebar-icon">📁</span>
                            자료실
                        </button>
                    </li>

                    {/* ✅ 여기 추가 */}
                    <li className="sidebar-menu-item completion-rate">
                        <div className="completion-rate-label">
                            <span className="sidebar-icon">📈</span> 이수율
                        </div>
                        <progress value={completionRate} max={100}></progress>
                        <span>{completionRate}% </span>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default LectureSidebar;
