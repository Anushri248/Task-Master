import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Filter, ArrowUpDown, XCircle } from 'lucide-react';

const Filters = () => {
  const {
    filter, setFilter,
    categoryFilter, setCategoryFilter,
    priorityFilter, setPriorityFilter,
    sortBy, setSortBy,
    specialFilter,
    setSpecialFilter,
    setPage,
  } = useContext(TaskContext);

  const hasActiveFilter = filter !== 'all' || sortBy !== 'newest' || categoryFilter !== 'all' || priorityFilter !== 'all';
  const isAnyActive = hasActiveFilter || !!specialFilter;

  const clearAll = () => {
    setFilter('all');
    setSortBy('newest');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSpecialFilter('');
    setPage(1);
  };

  return (
    <div className="list-controls">
      <select value={filter} onChange={e => { setFilter(e.target.value); setSpecialFilter(''); setPage(1); }}>
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setSpecialFilter(''); setPage(1); }}>
        <option value="all">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setSpecialFilter(''); setPage(1); }}>
        <option value="all">All Categories</option>
        <option value="college">🏫 College</option>
        <option value="work">💼 Work</option>
        <option value="personal">🏠 Personal</option>
        <option value="ideas">💡 Ideas</option>
      </select>

      <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="dueDate">Due Date</option>
      </select>

      {isAnyActive && (
        <button
          className="btn-icon"
          onClick={clearAll}
          title="Clear all filters"
          style={{ color: 'var(--status-danger)', flexShrink: 0 }}
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
};

export default Filters;
