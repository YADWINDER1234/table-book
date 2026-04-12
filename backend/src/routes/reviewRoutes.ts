import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createReview,
  getReviewsByTable,
  getReviewsByUser,
  updateReview,
  deleteReview,
  markHelpful,
  getReviewStats,
} from '../controllers/reviewController';

const router = Router();

router.post('/', authMiddleware, createReview);
router.get('/table/:tableId', getReviewsByTable);
router.get('/user/my-reviews', authMiddleware, getReviewsByUser);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
router.patch('/:id/helpful', markHelpful);
router.get('/stats', getReviewStats);

export default router;
