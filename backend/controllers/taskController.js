import Task from '../models/Task.js';

// @desc    Get task statistics (counts + notifications)
// @route   GET /api/tasks/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    // Use start of today (midnight) so tasks due "today" are NOT counted as overdue
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // End of 2 days from now (for "due soon" window)
    const endOfSoon = new Date();
    endOfSoon.setDate(endOfSoon.getDate() + 2);
    endOfSoon.setHours(23, 59, 59, 999);

    const [pending, inProgress, completed, overdue, dueSoon, highPriority] = await Promise.all([
      Task.countDocuments({ status: 'pending' }),
      Task.countDocuments({ status: 'in_progress' }),
      Task.countDocuments({ status: 'completed' }),
      // Overdue: due date is BEFORE today's midnight AND not completed
      Task.countDocuments({
        status: { $ne: 'completed' },
        dueDate: { $lt: startOfToday },
      }),
      // Due soon: due date is today or within next 2 days AND not completed
      Task.countDocuments({
        status: { $ne: 'completed' },
        dueDate: { $gte: startOfToday, $lte: endOfSoon },
      }),
      // High priority tasks that are not completed
      Task.countDocuments({
        priority: 'high',
        status: { $ne: 'completed' },
      }),
    ]);

    const total = pending + inProgress + completed;

    res.status(200).json({ total, pending, inProgress, completed, overdue, dueSoon, highPriority });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all tasks (with optional filtering and sorting)
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const { status, sortBy, category, search } = req.query;
    const specialFilter = req.query.specialFilter; // 'overdue' | 'due_soon' | 'high_priority'
    
    // Base date references
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfSoon = new Date();
    endOfSoon.setDate(endOfSoon.getDate() + 2);
    endOfSoon.setHours(23, 59, 59, 999);

    // Filtering
    let query = {};

    // Special filters take precedence
    if (specialFilter === 'overdue') {
      query.status = { $ne: 'completed' };
      query.dueDate = { $lt: startOfToday };
    } else if (specialFilter === 'due_soon') {
      query.status = { $ne: 'completed' };
      query.dueDate = { $gte: startOfToday, $lte: endOfSoon };
    } else if (specialFilter === 'high_priority') {
      query.priority = 'high';
      query.status = { $ne: 'completed' };
    } else {
      // Normal filters
      if (status && status !== 'all') {
        query.status = status;
      }
      if (category && category !== 'all') {
        query.category = category;
      }
      if (req.query.priority && req.query.priority !== 'all') {
        query.priority = req.query.priority;
      }
    }

    // Search applies on top of any filter
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Pagination setup
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalTasks / limit));

    let tasks;
    if (sortBy === 'dueDate') {
      // Use aggregation to sort 'Anytime' (null dates) to the bottom
      tasks = await Task.aggregate([
        { $match: query },
        { 
          $addFields: { 
            hasDueDate: { $cond: [{ $ifNull: ["$dueDate", false] }, 1, 0] } 
          }
        },
        { $sort: { hasDueDate: -1, dueDate: 1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
    } else {
      let sortOptions = { createdAt: -1 }; // Default: newest first
      if (sortBy === 'oldest') {
        sortOptions = { createdAt: 1 };
      }
      tasks = await Task.find(query).sort(sortOptions).skip(skip).limit(limit);
    }

    res.status(200).json({
      tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: page,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, category, priority, dueDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Title is required');
    }

    const task = await Task.create({
      title,
      description,
      status,
      category,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await Task.deleteOne({ _id: id });

    res.status(200).json({ id });
  } catch (error) {
    next(error);
  }
};
