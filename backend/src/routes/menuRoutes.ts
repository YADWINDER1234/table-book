import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByCategory,
  updateMenuItemAvailability,
  getMenuStats,
} from '../controllers/menuController';

const router = Router();

// Public routes
router.get('/', getAllMenuItems);
router.get('/by-category', getMenuByCategory);
router.get('/:id', getMenuItemById);
router.get('/stats', getMenuStats);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createMenuItem);
router.put('/:id', authMiddleware, adminMiddleware, updateMenuItem);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMenuItem);
router.patch('/:id/availability', authMiddleware, adminMiddleware, updateMenuItemAvailability);

export default router;
