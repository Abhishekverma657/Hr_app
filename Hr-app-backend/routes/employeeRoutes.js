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

        

router.get('/me', protect, getMyProfile);
router.put('/:id', protect,  updateEmployee);
router.get('/',  protect, isAdmin,  getEmployees);
router.get('/:id', protect, isAdmin,  getEmployee);

 
 
router.post('/', protect, isAdmin, uploadMemory.single('photo'), addEmployee);
 
router.delete('/:id', protect,isAdmin,  deleteEmployee);

export default router;
