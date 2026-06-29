import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [specialFilter, setSpecialFilter] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks?status=${filter}&sortBy=${sortBy}&category=${categoryFilter}&priority=${priorityFilter}&page=${page}&limit=${limit}&search=${search}&specialFilter=${specialFilter}`);
      setTasks(response.data.tasks);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      showNotification('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy, categoryFilter, priorityFilter, page, search, specialFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      showNotification('Task created successfully');
      setPage(1);
      fetchTasks();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
      showNotification('Failed to create task', 'error');
      return false;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
      showNotification('Task updated successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      showNotification('Failed to update task', 'error');
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      showNotification('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      showNotification('Failed to delete task', 'error');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        notification,
        filter,
        categoryFilter,
        priorityFilter,
        sortBy,
        search,
        specialFilter,
        page,
        totalPages,
        setFilter,
        setCategoryFilter,
        setPriorityFilter,
        setSortBy,
        setSearch,
        setSpecialFilter,
        setPage,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
