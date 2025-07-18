import express from 'express';
import {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getMyProfile
} from '../controllers/employeeController.js';

import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/roleCheck.js';

import uploadMemory from '../middlewares/uploadMemory.js';

const router = express.Router();

router.use(protect, isAdmin); // Only Admin can access these routes

router.get('/',  getEmployees);
router.get('/:id', getEmployee);

router.get('/me', protect, getMyProfile);
// router.post('/', addEmployee);
router.post('/', isAdmin, uploadMemory.single('photo'), addEmployee);
router.put('/:id', protect,  updateEmployee);
router.delete('/:id',isAdmin,  deleteEmployee);

export default router;
