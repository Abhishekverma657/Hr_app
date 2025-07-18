import express from 'express';
import {
  createOrUpdatePayroll,
  getPayrolls,
  myPayslips,
} from '../controllers/payrollController.js';

import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/roleCheck.js';

const router = express.Router();

// Admin routes
router.post('/', protect, isAdmin, createOrUpdatePayroll);
router.get('/all', protect, isAdmin, getPayrolls);

// Employee route
router.get('/my', protect, myPayslips);

export default router;
