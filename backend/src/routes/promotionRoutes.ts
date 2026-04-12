import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  createPromoCode,
  validatePromoCode,
  redeemPromoCode,
  getAllPromos,
  updatePromoCode,
  deletePromoCode,
  generateReferralLink,
  validateReferral,
  completeReferral,
  getPromoStats,
} from '../controllers/promotionController';

const router = Router();

// Public/User routes
router.post('/validate', authMiddleware, validatePromoCode);
router.post('/redeem', authMiddleware, redeemPromoCode);
router.post('/referral/generate', authMiddleware, generateReferralLink);
router.post('/referral/validate', validateReferral);
router.post('/referral/complete', authMiddleware, completeReferral);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllPromos);
router.post('/', authMiddleware, adminMiddleware, createPromoCode);
router.put('/:id', authMiddleware, adminMiddleware, updatePromoCode);
router.delete('/:id', authMiddleware, adminMiddleware, deletePromoCode);
router.get('/stats', authMiddleware, adminMiddleware, getPromoStats);

export default router;
