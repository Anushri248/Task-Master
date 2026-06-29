import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
  const { page, setPage, totalPages, loading } = useContext(TaskContext);

  if (totalPages <= 1 || loading) return null;

  return (
    <div className="pagination">
      <button
        className="btn-icon"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        style={{ opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
      >
        <ChevronLeft size={20} />
      </button>

      <span>Page <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> of {totalPages}</span>

      <button
        className="btn-icon"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        style={{ opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
