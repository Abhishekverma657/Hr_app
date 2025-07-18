import express from 'express';
import {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';

import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/roleCheck.js';

import uploadMemory from '../middlewares/uploadMemory.js';

const router = express.Router();

router.use(protect, isAdmin); // Only Admin can access these routes

router.get('/', getEmployees);
router.get('/:id', getEmployee);
// router.post('/', addEmployee);
router.post('/', uploadMemory.single('photo'), addEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
