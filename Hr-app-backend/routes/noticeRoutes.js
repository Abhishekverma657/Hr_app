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
router.get('/all', protect, getAllNotices);
router.post('/', protect, isAdmin, createNotice);
 
router.delete('/:id', protect, isAdmin, deleteNotice);

// Employee
// router.get('/active', protect, getActiveNotices);

export default router;
