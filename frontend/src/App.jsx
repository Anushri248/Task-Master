import React, { useState, useContext, useEffect } from 'react';
import { TaskProvider, TaskContext } from './context/TaskContext';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filters from './components/Filters';
import SearchBar from './components/SearchBar';
import StatsPanel from './components/StatsPanel';
import { CheckSquare, Sun, Moon, Plus } from 'lucide-react';

const Dashboard = () => {
  const { notification, tasks } = useContext(TaskContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Theme — persisted in localStorage
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const openAdd = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  return (
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">
          <CheckSquare size={28} color="var(--primary-color)" />
          Task Master
        </h1>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setIsDark(p => !p)}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? 'Light' : 'Dark'}
          </button>

          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} />
            New Task
          </button>
        </div>
      </header>

      {/* Two-column layout: stats sidebar + task list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Stats Sidebar */}
        <StatsPanel />

        {/* Task Panel */}
        <div className="glass-card list-panel">
          <SearchBar />
          <Filters />
          <TaskList onEdit={openEdit} />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm editingTask={editingTask} onClose={closeModal} />
      </Modal>

      {/* Toast */}
      {notification && (
        <div className="toast">{notification.message}</div>
      )}
    </div>
  );
};

function App() {
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}

export default App;
