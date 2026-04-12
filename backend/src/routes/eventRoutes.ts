import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  createGroupEvent,
  getEventById,
  updateEventStatus,
  getAllGroupEvents,
  addBookingToEvent,
  generateEventProposal,
  getAllEventPackages,
  createEventPackage,
  updateEventPackage,
  getEventStats,
} from '../controllers/eventController';

const router = Router();

// User routes
router.post('/', authMiddleware, createGroupEvent);
router.get('/my-events', authMiddleware, getAllGroupEvents);
router.get('/:id', authMiddleware, getEventById);
router.get('/:id/proposal', authMiddleware, generateEventProposal);

// Admin routes
router.put('/:id/status', authMiddleware, adminMiddleware, updateEventStatus);
router.post('/:id/booking', authMiddleware, adminMiddleware, addBookingToEvent);
router.get('/stats', authMiddleware, adminMiddleware, getEventStats);

// Event Packages (public)
router.get('/packages', getAllEventPackages);
router.get('/packages/:id', getAllEventPackages);

// Admin package management
router.post('/packages', authMiddleware, adminMiddleware, createEventPackage);
router.put('/packages/:id', authMiddleware, adminMiddleware, updateEventPackage);

export default router;
