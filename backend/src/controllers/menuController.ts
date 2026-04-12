import { Request, Response } from 'express';
import MenuItem from '../models/Menu';
import { AppError } from '../utils/errors';

export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    const { category, available } = req.query;

    let filter: any = {};
    if (category) filter.category = category;
    if (available === 'true') filter.availability = true;

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch menu items');
  }
};

export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      throw new AppError(404, 'Menu item not found');
    }
  } catch (error) {
    throw error;
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price, dietary, allergens } = req.body;

    const newItem = new MenuItem({
      name,
      description,
      category,
      price,
      dietary: dietary || { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false },
      allergens: allergens || [],
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to create menu item');
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await MenuItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      throw new AppError(404, 'Menu item not found');
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: item,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      throw new AppError(404, 'Menu item not found');
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const getMenuByCategory = async (req: Request, res: Response) => {
  try {
    const items = await MenuItem.find({ availability: true }).sort({ category: 1 });

    const groupedByCategory = items.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: groupedByCategory,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch menu');
  }
};

export const updateMenuItemAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    const item = await MenuItem.findByIdAndUpdate(
      id,
      { availability },
      { new: true }
    );

    if (!item) {
      throw new AppError(404, 'Menu item not found');
    }

    res.status(200).json({
      success: true,
      message: 'Menu item availability updated',
      data: item,
    });
  } catch (error) {
    throw error;
  }
};

export const getMenuStats = async (req: Request, res: Response) => {
  try {
    const totalItems = await MenuItem.countDocuments();
    const availableItems = await MenuItem.countDocuments({ availability: true });
    const averagePrice = await MenuItem.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } },
    ]);

    const itemsByCategory = await MenuItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        availableItems,
        averagePrice: averagePrice[0]?.avgPrice || 0,
        itemsByCategory,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch menu stats');
  }
};
