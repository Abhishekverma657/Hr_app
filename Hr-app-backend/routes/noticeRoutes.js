import express from 'express';
import {
  createNotice,
  getActiveNotices,
  getAllNotices,
  deleteNotice,
} from '../controllers/noticeController.js';

import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/roleCheck.js';

const router = express.Router();

// Admin
router.post('/', protect, isAdmin, createNotice);
router.get('/all', protect, isAdmin, getAllNotices);
router.delete('/:id', protect, isAdmin, deleteNotice);

// Employee
router.get('/active', protect, getActiveNotices);

export default router;
