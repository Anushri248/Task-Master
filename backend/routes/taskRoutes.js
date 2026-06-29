import express from 'express';
import {
  getTasks,
  getStats,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/').get(getTasks).post(createTask);
router.route('/stats').get(getStats);
router.route('/:id').put(updateTask).delete(deleteTask);

export default router;
