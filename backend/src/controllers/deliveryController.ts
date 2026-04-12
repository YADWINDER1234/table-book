import { Request, Response } from 'express';
import Delivery from '../models/Delivery';
import MenuItem from '../models/Menu';
import { AppError } from '../utils/errors';
import { sendDeliveryConfirmationEmail, sendSpecialOccasionEmail } from '../utils/email';
import { v4 as uuidv4 } from 'uuid';

export const createDelivery = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userEmail = (req as any).user?.email;
    
    console.log('📦 Creating delivery with userId:', userId);
    console.log('📦 Creating delivery with request body:', JSON.stringify(req.body, null, 2));

    const {
      items,
      deliveryAddress,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      recipientName,
      recipientPhone,
      deliveryNotes,
      specialOccasion,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ No items in order');
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!deliveryAddress || !city || !postalCode) {
      console.error('❌ Missing address:', { deliveryAddress, city, postalCode });
      return res.status(400).json({ message: 'Missing delivery address details' });
    }

    // Validate menu items and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (let item of items) {
      try {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem) {
          console.error(`❌ Menu item not found: ${item.menuItemId}`);
          return res.status(404).json({ message: `Menu item ${item.menuItemId} not found` });
        }
        const quantity = item.quantity || 1;
        totalAmount += menuItem.price * quantity;
        validatedItems.push({
          menuItemId: item.menuItemId,
          name: item.name || menuItem.name,
          price: menuItem.price,
          quantity: quantity,
        });
      } catch (itemError) {
        console.error('❌ Error validating item:', itemError);
        return res.status(500).json({ message: 'Error validating menu items' });
      }
    }

    const deliveryFee = 25;
    const deliveryId = `DEL-${Date.now()}-${uuidv4().slice(0, 8)}`;

    console.log('✅ Validated items, creating delivery document');

    const delivery = new Delivery({
      deliveryId,
      userId,
      items: validatedItems,
      deliveryAddress: {
        street: deliveryAddress,
        city: city,
        state: state || '',
        zipCode: postalCode,
        latitude: latitude || 0,
        longitude: longitude || 0,
      },
      recipientName: recipientName || 'Guest',
      recipientPhone: recipientPhone || '+91-0000000000',
      deliveryNotes: deliveryNotes || '',
      specialOccasion: specialOccasion || { type: 'regular' },
      totalAmount,
      deliveryFee,
      paymentStatus: 'paid',
      status: 'confirmed',
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
    });

    await delivery.save();
    console.log('✅ Delivery saved successfully:', deliveryId);

    res.status(201).json({
      success: true,
      message: 'Delivery order created successfully',
      data: delivery,
    });
  } catch (error) {
    console.error('❌ Delivery creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create delivery order';
    res.status(500).json({ message: errorMessage });
  }
};

export const getDeliveryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id).populate('items.menuItemId').populate('userId', 'email name');

    if (!delivery) {
      throw new AppError(404, 'Delivery order not found');
    }

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserDeliveries = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).userId;

    const deliveries = await Delivery.find({ userId })
      .populate('items.menuItemId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: deliveries,
      count: deliveries.length,
    });
  } catch (error) {
    throw error;
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      id,
      { 
        status,
        ...(status === 'delivered' && { deliveredAt: new Date() })
      },
      { new: true }
    );

    if (!delivery) {
      throw new AppError(404, 'Delivery order not found');
    }

    res.status(200).json({
      success: true,
      message: 'Delivery status updated',
      data: delivery,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllDeliveries = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let filter: any = {};
    if (status) filter.status = status;

    const deliveries = await Delivery.find(filter)
      .populate('userId', 'firstName lastName phone email')
      .populate('items.menuItemId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: deliveries,
      count: deliveries.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch deliveries');
  }
};

export const getDeliveryStats = async (req: Request, res: Response) => {
  try {
    const totalDeliveries = await Delivery.countDocuments();
    const completedDeliveries = await Delivery.countDocuments({ status: 'delivered' });
    const pendingDeliveries = await Delivery.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing'] } });

    const totalRevenue = await Delivery.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDeliveries,
        completedDeliveries,
        pendingDeliveries,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch delivery stats');
  }
};
