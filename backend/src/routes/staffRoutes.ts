import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  updateStaffAvailability,
  rateStaffPerformance,
  getStaffStats,
} from '../controllers/staffController';

const router = Router();

// Admin routes
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);
router.patch('/:id/availability', updateStaffAvailability);
router.post('/:id/rate', rateStaffPerformance);
router.get('/stats', getStaffStats);

export default router;
