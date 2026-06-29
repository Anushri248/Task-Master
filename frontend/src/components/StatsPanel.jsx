import React, { useEffect, useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import api from '../api/axios';
import {
  CheckCircle, Clock, AlertCircle, AlertTriangle,
  Layers, Bell, TrendingUp, Flame,
} from 'lucide-react';

const StatsPanel = () => {
  const {
    setFilter, setSortBy, setPage,
    setSpecialFilter, setPriorityFilter, setCategoryFilter,
    tasks,
  } = useContext(TaskContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (e) {
      console.error('Failed to fetch stats', e);
    } finally {
      setLoading(false);
    }
  };

  // Refresh stats whenever tasks change (add/edit/delete)
  useEffect(() => {
    fetchStats();
  }, [tasks]);

  // Apply a special filter — clears all other filters first
  const applySpecial = (special, sortOverride = 'dueDate') => {
    setSpecialFilter(special);
    setFilter('all');
    setSortBy(sortOverride);
    setPriorityFilter('all');
    setCategoryFilter('all');
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply a normal status filter
  const applyStatus = (status) => {
    setSpecialFilter('');
    setFilter(status);
    setSortBy('newest');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || !stats) return (
    <div style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
      Loading...
    </div>
  );

  const summaryCards = [
    {
      label: 'Total',
      count: stats.total,
      icon: <Layers size={16} />,
      color: 'var(--primary-color)',
      onClick: () => applyStatus('all'),
    },
    {
      label: 'Pending',
      count: stats.pending,
      icon: <AlertCircle size={16} />,
      color: 'var(--status-pending)',
      onClick: () => applyStatus('pending'),
    },
    {
      label: 'In Progress',
      count: stats.inProgress,
      icon: <Clock size={16} />,
      color: 'var(--status-progress)',
      onClick: () => applyStatus('in_progress'),
    },
    {
      label: 'Completed',
      count: stats.completed,
      icon: <CheckCircle size={16} />,
      color: 'var(--status-completed)',
      onClick: () => applyStatus('completed'),
    },
  ];

  // Build alerts — only show relevant ones
  const alerts = [];

  if (stats.overdue > 0) {
    alerts.push({
      id: 'overdue',
      icon: <AlertTriangle size={14} />,
      color: 'var(--status-danger)',
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: `${stats.overdue} task${stats.overdue !== 1 ? 's are' : ' is'} overdue`,
      sub: 'Click to view overdue tasks',
      onClick: () => applySpecial('overdue', 'dueDate'),
    });
  }

  if (stats.dueSoon > 0) {
    alerts.push({
      id: 'dueSoon',
      icon: <Bell size={14} />,
      color: 'var(--status-pending)',
      bg: 'rgba(251, 191, 36, 0.08)',
      border: 'rgba(251, 191, 36, 0.25)',
      text: `${stats.dueSoon} task${stats.dueSoon !== 1 ? 's are' : ' is'} due within 2 days`,
      sub: 'Click to view upcoming deadlines',
      onClick: () => applySpecial('due_soon', 'dueDate'),
    });
  }

  if (stats.highPriority > 0) {
    alerts.push({
      id: 'highPriority',
      icon: <Flame size={14} />,
      color: 'var(--status-danger)',
      bg: 'rgba(239, 68, 68, 0.06)',
      border: 'rgba(239, 68, 68, 0.2)',
      text: `${stats.highPriority} high priority task${stats.highPriority !== 1 ? 's' : ''} pending`,
      sub: 'Click to view high priority tasks',
      onClick: () => applySpecial('high_priority', 'newest'),
    });
  }

  if (stats.inProgress > 0) {
    alerts.push({
      id: 'inProgress',
      icon: <TrendingUp size={14} />,
      color: 'var(--status-progress)',
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.2)',
      text: `${stats.inProgress} task${stats.inProgress !== 1 ? 's are' : ' is'} in progress`,
      sub: 'Click to view active tasks',
      onClick: () => applyStatus('in_progress'),
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'allgood',
      icon: <CheckCircle size={14} />,
      color: 'var(--status-completed)',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.2)',
      text: 'All caught up!',
      sub: null,
      onClick: null,
    });
  }

  const donePercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1.5rem' }}>

      {/* Overview Cards */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.9rem' }}>
          Overview
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
          {summaryCards.map(card => (
            <button
              key={card.label}
              onClick={card.onClick}
              title={`Filter: ${card.label}`}
              style={{
                background: `${card.color}10`,
                border: `1px solid ${card.color}28`,
                borderRadius: 'var(--border-radius-md)',
                padding: '0.8rem 0.65rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${card.color}1f`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${card.color}22`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `${card.color}10`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ color: card.color, marginBottom: '0.35rem' }}>{card.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.count}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 500 }}>{card.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Progress
          </p>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--status-completed)' }}>{donePercent}%</span>
        </div>
        <div style={{
          width: '100%', height: '7px', background: 'var(--glass-border)',
          borderRadius: '99px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${donePercent}%`,
            background: 'linear-gradient(90deg, var(--primary-color), var(--status-completed))',
            borderRadius: '99px',
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          {stats.completed} of {stats.total} completed
        </p>
      </div>

      {/* Alerts */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.9rem' }}>
          Alerts
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {alerts.map(a => (
            <div
              key={a.id}
              onClick={a.onClick || undefined}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--border-radius-sm)',
                background: a.bg,
                border: `1px solid ${a.border}`,
                cursor: a.onClick ? 'pointer' : 'default',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => { if (a.onClick) e.currentTarget.style.opacity = '0.75'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <span style={{ color: a.color, flexShrink: 0, marginTop: '1px' }}>{a.icon}</span>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>{a.text}</p>
                {a.sub && <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{a.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default StatsPanel;
