import { Request, Response } from 'express';
import Order from '../models/Order';
import MenuItem from '../models/Menu';
import { AppError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { bookingId, items, orderType, notes } = req.body;
    const userId = (req as any).userId;

    // Calculate total
    let totalAmount = 0;
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        throw new AppError(404, `Menu item ${item.menuItemId} not found`);
      }
      totalAmount += menuItem.price * item.quantity;
    }

    const orderId = `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`;

    const newOrder = new Order({
      orderId,
      bookingId,
      userId,
      items,
      totalAmount,
      orderType: orderType || 'dine-in',
      notes,
    });

    await newOrder.save();
    await newOrder.populate('items.menuItemId');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('items.menuItemId')
      .populate('bookingId')
      .populate('preparedBy');

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    throw error;
  }
};

export const getOrdersByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const orders = await Order.find({ bookingId })
      .populate('items.menuItemId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch orders');
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, preparedBy } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, preparedBy: preparedBy || undefined, 
        ...(status === 'completed' && { completedAt: new Date() })
      },
      { new: true, runValidators: true }
    ).populate('items.menuItemId');

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    throw error;
  }
};

export const updateOrderPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: order,
    });
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled',
      data: order,
    });
  } catch (error) {
    throw error;
  }
};

export const getKitchenDisplay = async (req: Request, res: Response) => {
  try {
    // Orders that need to be prepared
    const pendingOrders = await Order.find({
      status: { $in: ['pending', 'preparing'] },
    })
      .populate('items.menuItemId')
      .populate('bookingId', 'tableId numberOfGuests')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: pendingOrders,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch kitchen orders');
  }
};

export const splitBill = async (req: Request, res: Response) => {
  try {
    const { orderId, numberOfWays } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    const splitAmount = order.totalAmount / numberOfWays;

    res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        originalAmount: order.totalAmount,
        splitAmount,
        numberOfWays,
        breakdownPerPerson: (order.totalAmount / numberOfWays).toFixed(2),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const avgOrderValue = await Order.aggregate([
      { $group: { _id: null, avg: { $avg: '$totalAmount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        ordersByStatus,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgOrderValue: avgOrderValue[0]?.avg || 0,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch order stats');
  }
};
