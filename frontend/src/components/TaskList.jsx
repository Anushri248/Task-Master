import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import Pagination from './Pagination';
import { Loader2, ClipboardList } from 'lucide-react';

const TaskList = ({ onEdit }) => {
  const { tasks, loading, error } = useContext(TaskContext);

  if (loading) {
    return (
      <div className="spinner">
        <Loader2 size={30} color="var(--primary-color)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" style={{ color: 'var(--status-danger)' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={48} />
        <p>No tasks found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task._id} task={task} onEdit={onEdit} />
      ))}
      <Pagination />
    </div>
  );
};

export default TaskList;
