import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            navigate(`/lectures?page=1&keyword=${encodeURIComponent(input.trim())}`);
        }
    };

    return (
        <div className={`main-search-bar ${className || ''}`}>
            <input
                type="text"
                placeholder="강의명을 검색하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(e as any);
                }}
            />
            <button onClick={handleSearch}>검색</button>
        </div>
    );
};

export default SearchBar;
