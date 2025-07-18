import express from 'express';
import {
  applyResignation,
  myResignation,
  getAllResignations,
  updateResignationStatus,
} from '../controllers/exitController.js';

import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/roleCheck.js';

const router = express.Router();

// Employee
router.post('/apply', protect, applyResignation);
router.get('/my', protect, myResignation);

// Admin
router.get('/all', protect, isAdmin, getAllResignations);
router.put('/status/:id', protect, isAdmin, updateResignationStatus);

export default router;
