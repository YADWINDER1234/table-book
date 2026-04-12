import { Request, Response } from 'express';
import { InventoryItem, InventoryLog } from '../models/Inventory';
import { AppError } from '../utils/errors';
import mongoose from 'mongoose';

export const getAllInventoryItems = async (req: Request, res: Response) => {
  try {
    const { category, lowStock } = req.query;

    let filter: any = {};
    if (category) filter.category = category;
    if (lowStock === 'true') filter.quantity = { $lt: mongoose.Types.ObjectId };

    const items = await InventoryItem.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch inventory');
  }
};

export const getInventoryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await InventoryItem.findById(id);
    if (!item) {
      throw new AppError(404, 'Inventory item not found');
    }

    const logs = await InventoryLog.find({ itemId: id }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      data: { item, recentLogs: logs },
    });
  } catch (error) {
    throw error;
  }
};

export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, unit, minThreshold, maxThreshold, supplier, cost } =
      req.body;

    const newItem = new InventoryItem({
      name,
      category,
      quantity,
      unit,
      minThreshold,
      maxThreshold,
      supplier,
      cost,
      lastRestocked: new Date(),
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Inventory item created',
      data: newItem,
    });
  } catch (error) {
    throw error;
  }
};

export const updateInventoryQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, quantity, reason } = req.body;

    const item = await InventoryItem.findById(id);
    if (!item) {
      throw new AppError(404, 'Inventory item not found');
    }

    if (type === 'add') {
      item.quantity += quantity;
      item.lastRestocked = new Date();
    } else if (type === 'use') {
      if (item.quantity < quantity) {
        throw new AppError(400, 'Insufficient quantity');
      }
      item.quantity -= quantity;
    } else if (type === 'waste') {
      if (item.quantity < quantity) {
        throw new AppError(400, 'Insufficient quantity');
      }
      item.quantity -= quantity;
    }

    await item.save();

    // Log the transaction
    const log = new InventoryLog({
      itemId: id,
      type,
      quantity,
      reason,
    });
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Inventory updated',
      data: item,
    });
  } catch (error) {
    throw error;
  }
};

export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const items = await InventoryItem.find({
      $expr: { $lte: ['$quantity', '$minThreshold'] },
    });

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch low stock items');
  }
};

export const getInventoryReport = async (req: Request, res: Response) => {
  try {
    const totalItems = await InventoryItem.countDocuments();
    const lowStockCount = await InventoryItem.countDocuments({
      $expr: { $lte: ['$quantity', '$minThreshold'] },
    });

    const totalValue = await InventoryItem.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$cost'] } } } },
    ]);

    const itemsByCategory = await InventoryItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: { $multiply: ['$quantity', '$cost'] } } } },
    ]);

    const expiringItems = await InventoryItem.find({
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        lowStockCount,
        totalInventoryValue: totalValue[0]?.total || 0,
        itemsByCategory,
        expiringItemsCount: expiringItems.length,
        expiringItems,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to generate inventory report');
  }
};

export const getInventoryLogs = async (req: Request, res: Response) => {
  try {
    const { itemId, limit = 50 } = req.query;

    let filter: any = {};
    if (itemId) filter.itemId = itemId;

    const logs = await InventoryLog.find(filter)
      .populate('itemId')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch logs');
  }
};
