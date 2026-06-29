import React, { useContext, useState, useEffect, useRef } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const { setSearch, setPage } = useContext(TaskContext);
  const [localSearch, setLocalSearch] = useState('');
  const debounceTimer = useRef(null);

  const applySearch = (value) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 400);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    applySearch(value);
  };

  const handleClear = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setLocalSearch('');
    setSearch('');
    setPage(1);
  };

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  return (
    <div className="search-bar-wrapper">
      <Search size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
      <input
        id="task-search"
        type="text"
        placeholder="Search tasks..."
        value={localSearch}
        onChange={handleChange}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          padding: '0.65rem 0',
          color: 'var(--text-primary)',
          fontSize: '0.88rem',
          width: '100%',
        }}
      />
      {localSearch && (
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
          style={{
            background: 'var(--btn-icon-hover)',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            flexShrink: 0,
            padding: 0,
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
