import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createDelivery,
  getDeliveryById,
  getUserDeliveries,
  updateDeliveryStatus,
  getAllDeliveries,
  getDeliveryStats,
} from '../controllers/deliveryController';

const router = Router();

// Customer routes
router.post('/create', authMiddleware, createDelivery); // Create delivery order
router.get('/user', authMiddleware, getUserDeliveries); // Get user's deliveries
router.get('/:id', authMiddleware, getDeliveryById); // Get specific delivery

// Admin routes
router.put('/:id/status', authMiddleware, updateDeliveryStatus); // Update delivery status
router.get('/', authMiddleware, getAllDeliveries); // Get all deliveries (admin)
router.get('/stats/overview', authMiddleware, getDeliveryStats); // Get delivery stats

export default router;
