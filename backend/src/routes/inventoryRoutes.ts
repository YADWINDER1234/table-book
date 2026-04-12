import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryQuantity,
  getLowStockItems,
  getInventoryReport,
  getInventoryLogs,
} from '../controllers/inventoryController';

const router = Router();

// Admin routes
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllInventoryItems);
router.get('/low-stock', getLowStockItems);
router.get('/report', getInventoryReport);
router.get('/logs', getInventoryLogs);
router.get('/:id', getInventoryItemById);
router.post('/', createInventoryItem);
router.patch('/:id/quantity', updateInventoryQuantity);

export default router;
