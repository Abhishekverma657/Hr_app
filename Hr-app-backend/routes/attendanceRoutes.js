import express from 'express';
import {
  checkIn,
  checkOut,
  myAttendance,
  allAttendance,
  faceCheckInOut
} from '../controllers/attendanceController.js';

import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/roleCheck.js';

import uploadMemory from '../middlewares/uploadMemory.js';

const router = express.Router();

// Employee routes
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/my', protect, myAttendance);
router.post('/face-check', uploadMemory.single('photo'), faceCheckInOut);

// Admin route
router.get('/all', protect, isAdmin, allAttendance);

export default router;
