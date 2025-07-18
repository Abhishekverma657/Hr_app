import express from 'express';
import {
  applyLeave,
  myLeaves,
  allLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController.js';

import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/roleCheck.js';

const router = express.Router();

// Employee routes
router.post('/apply', protect, applyLeave);
router.get('/my', protect, myLeaves);

// Admin routes
router.get('/all', protect, isAdmin, allLeaves);
router.put('/status/:id', protect, isAdmin, updateLeaveStatus);

export default router;
