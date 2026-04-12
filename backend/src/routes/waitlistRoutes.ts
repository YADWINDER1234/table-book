import express from 'express';
import { joinWaitlist } from '../controllers/waitlistController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All waitlist routes require authentication
router.use(authMiddleware);

router.post('/', joinWaitlist);

export default router;
