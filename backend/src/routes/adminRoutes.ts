import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllBookings,
  getBookingStats,
  getDashboardAnalytics,
  updateBookingStatus,
} from '../controllers/adminController';
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from '../controllers/tableController';

const router = Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Bookings
router.get('/bookings', getAllBookings);
router.get('/bookings/stats', getBookingStats);
router.put('/bookings/:id/status', updateBookingStatus);

// Analytics
router.get('/analytics/dashboard', getDashboardAnalytics);

// Tables
router.get('/tables', getAllTables);
router.get('/tables/:id', getTableById);
router.post('/tables', createTable);
router.put('/tables/:id', updateTable);
router.delete('/tables/:id', deleteTable);

export default router;
