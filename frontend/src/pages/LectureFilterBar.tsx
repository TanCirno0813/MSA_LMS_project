
import React from 'react';
import './LectureFilterBar.css';

interface LectureFilterBarProps {
    selectedCategory: string;
    selectedLevel: string;
    keyword: string;
    onCategoryChange: (category: string) => void;
    onLevelChange: (level: string) => void;
    onKeywordChange: (keyword: string) => void;
    onSearch: () => void;
}

const categories = ['전체', '공통 필수', '신입사원', '사무 기획', '리더십/관리자', '자기개발','디지털 시대'];


const LectureFilterBar: React.FC<LectureFilterBarProps> = ({
                                                               selectedCategory,
                                                               onCategoryChange,
                                                               keyword,
                                                               onKeywordChange,
                                                               onSearch
                                                           }) => {
    return (
        <div className="filter-bar">
            {/* 🔍 검색창 */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="강의명을 검색하세요"
                    value={keyword}
                    onChange={(e) => onKeywordChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                />
                <button onClick={onSearch}>검색</button>
            </div>

            {/* 🏷 카테고리 필터 */}
            <div className="filter-group">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={selectedCategory === cat ? 'active' : ''}
                        onClick={() => onCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>


        </div>
    );
};

export default LectureFilterBar;
