import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  createOrder,
  getOrderById,
  getOrdersByBooking,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder,
  getKitchenDisplay,
  splitBill,
  getOrderStats,
} from '../controllers/orderController';

const router = Router();

// User routes
router.post('/', authMiddleware, createOrder);
router.get('/booking/:bookingId', authMiddleware, getOrdersByBooking);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/cancel', authMiddleware, cancelOrder);

// Admin routes
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.patch('/:id/payment-status', authMiddleware, adminMiddleware, updateOrderPaymentStatus);
router.get('/kitchen/display', authMiddleware, getKitchenDisplay);
router.post('/:id/split-bill', authMiddleware, splitBill);
router.get('/stats', authMiddleware, adminMiddleware, getOrderStats);

export default router;
