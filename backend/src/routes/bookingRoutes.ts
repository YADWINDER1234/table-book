import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getAvailableTables,
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} from '../controllers/bookingController';
import { getAllTables, getTableById } from '../controllers/tableController';

const router = Router();

// Tables
router.get('/tables', getAllTables);
router.get('/tables/available', getAvailableTables);
router.get('/tables/:id', getTableById);

// Bookings
router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings', authMiddleware, getUserBookings);
router.get('/bookings/:id', authMiddleware, getBookingById);
router.put('/bookings/:id', authMiddleware, updateBooking);
router.delete('/bookings/:id', authMiddleware, cancelBooking);

export default router;
