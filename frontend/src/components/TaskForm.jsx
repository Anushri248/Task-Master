import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';

const CATEGORIES = [
  { value: 'college', label: '🏫 College' },
  { value: 'work',    label: '💼 Work' },
  { value: 'personal',label: '🏠 Personal' },
  { value: 'ideas',   label: '💡 Ideas' },
];

const PRIORITIES = [
  { value: 'high',   label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '🟢 Low' },
];

const empty = { title: '', description: '', category: 'personal', priority: 'medium', dueDate: '' };

const TaskForm = ({ editingTask, onClose }) => {
  const { addTask, updateTask } = useContext(TaskContext);
  const [formData, setFormData] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title:       editingTask.title,
        description: editingTask.description || '',
        category:    editingTask.category    || 'personal',
        priority:    editingTask.priority    || 'medium',
        status:      editingTask.status      || 'pending',
        dueDate:     editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : '',
      });
    } else {
      setFormData(empty);
    }
    setErrors({});
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const success = editingTask
      ? await updateTask(editingTask._id, formData)
      : await addTask(formData);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          name="title"
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={handleChange}
          autoFocus
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          placeholder="Add more details... (optional)"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Category + Priority */}
      <div className="form-row">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Status (edit only) + Due Date */}
      <div className="form-row" style={{ marginTop: '0.75rem' }}>
        {editingTask && (
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
        <div className="form-group" style={{ margin: 0, gridColumn: editingTask ? 'auto' : '1 / -1' }}>
          <label className="form-label">Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : editingTask ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
