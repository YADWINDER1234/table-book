import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getUserLoyalty,
  addPoints,
  redeemPoints,
  getLoyaltyTransactions,
  checkBirthdayBonus,
  getLoyaltyStats,
} from '../controllers/loyaltyController';

const router = Router();

// User routes
router.get('/my-loyalty', authMiddleware, getUserLoyalty);
router.get('/transactions', authMiddleware, getLoyaltyTransactions);
router.post('/redeem', authMiddleware, redeemPoints);
router.get('/birthday-bonus', authMiddleware, checkBirthdayBonus);

// Admin routes
router.post('/add-points', authMiddleware, adminMiddleware, addPoints);
router.get('/stats', authMiddleware, adminMiddleware, getLoyaltyStats);

export default router;
