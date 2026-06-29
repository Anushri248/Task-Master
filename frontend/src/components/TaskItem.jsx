import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Edit2, Trash2, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const PRIORITY_CONFIG = {
  high:   { color: 'var(--status-danger)',    label: '🔴 High' },
  medium: { color: 'var(--status-pending)',   label: '🟡 Medium' },
  low:    { color: 'var(--status-completed)', label: '🟢 Low' },
};

const STATUS_CONFIG = {
  completed:   { color: 'var(--status-completed)', icon: <CheckCircle size={13} /> },
  in_progress: { color: 'var(--status-progress)',  icon: <Clock size={13} /> },
  pending:     { color: 'var(--status-pending)',    icon: <AlertCircle size={13} /> },
};

const CATEGORY_ICON = { college: '🏫', work: '💼', personal: '🏠', ideas: '💡' };

const TaskItem = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useContext(TaskContext);

  const statusCfg   = STATUS_CONFIG[task.status]   || STATUS_CONFIG.pending;
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const isOverdue = task.dueDate
    && isPast(new Date(task.dueDate))
    && !isToday(new Date(task.dueDate))
    && task.status !== 'completed';

  const handleStatusChange = (e) => {
    updateTask(task._id, { ...task, status: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) deleteTask(task._id);
  };

  return (
    <div
      className="task-card animate-fade-in"
      style={{
        borderLeftColor: statusCfg.color,
        opacity: task.status === 'completed' ? 0.65 : 1,
      }}
    >
      {/* Top row: title + actions */}
      <div className="task-card-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="task-title">
            <span title={task.category}>{CATEGORY_ICON[task.category] || '📌'}</span>
            <span style={{
              textDecoration: task.status === 'completed' ? 'line-through' : 'none',
              color: task.status === 'completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
              wordBreak: 'break-word',
            }}>
              {task.title}
            </span>
          </div>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>

        <div className="task-actions">
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit">
            <Edit2 size={15} />
          </button>
          <button className="btn-icon" onClick={handleDelete} style={{ color: 'var(--status-danger)' }} title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Bottom row: status + priority + due date */}
      <div className="task-card-bottom">
        <div className="task-badges">
          {/* Status dropdown badge */}
          <span className="badge" style={{
            backgroundColor: `${statusCfg.color}18`,
            color: statusCfg.color,
          }}>
            {statusCfg.icon}
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="status-select"
              style={{ color: statusCfg.color }}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </span>

          {/* Priority badge */}
          <span className="badge" style={{
            backgroundColor: `${priorityCfg.color}18`,
            color: priorityCfg.color,
          }}>
            {priorityCfg.label}
          </span>
        </div>

        {/* Due date */}
        <div className="task-meta" style={{ color: isOverdue ? 'var(--status-danger)' : 'var(--text-secondary)' }}>
          <Calendar size={13} />
          <span style={{ fontWeight: isOverdue ? 600 : 400 }}>
            {task.dueDate
              ? (isOverdue ? 'Overdue · ' : '') + format(new Date(task.dueDate), 'MMM d, yyyy')
              : 'Anytime'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
