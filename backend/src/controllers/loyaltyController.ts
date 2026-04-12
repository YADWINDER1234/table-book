import { Request, Response } from 'express';
import { UserLoyalty, LoyaltyTransaction } from '../models/UserLoyalty';
import { AppError } from '../utils/errors';

export const getUserLoyalty = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    let loyalty = await UserLoyalty.findOne({ userId }).populate('transactions');

    if (!loyalty) {
      // Create loyalty account if doesn't exist
      loyalty = new UserLoyalty({
        userId,
        points: 0,
        tier: 'Bronze',
        totalSpent: 0,
        totalBookings: 0,
      });
      await loyalty.save();
    }

    res.status(200).json({
      success: true,
      data: loyalty,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch loyalty data');
  }
};

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { userId, points, description, bookingId } = req.body;

    let loyalty = await UserLoyalty.findOne({ userId });
    if (!loyalty) {
      loyalty = new UserLoyalty({ userId });
    }

    loyalty.points += points;
    loyalty.totalBookings += 1;

    // Update tier based on points
    if (loyalty.points >= 5000) {
      loyalty.tier = 'Platinum';
    } else if (loyalty.points >= 3000) {
      loyalty.tier = 'Gold';
    } else if (loyalty.points >= 1000) {
      loyalty.tier = 'Silver';
    } else {
      loyalty.tier = 'Bronze';
    }

    await loyalty.save();

    // Create transaction log
    const transaction = new LoyaltyTransaction({
      loyaltyId: loyalty._id,
      type: 'earn',
      points,
      description,
      bookingId: bookingId || null,
    });
    await transaction.save();

    loyalty.transactions.push(transaction._id);
    await loyalty.save();

    res.status(200).json({
      success: true,
      message: 'Points added successfully',
      data: loyalty,
    });
  } catch (error) {
    throw error;
  }
};

export const redeemPoints = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { points, description } = req.body;

    const loyalty = await UserLoyalty.findOne({ userId });
    if (!loyalty) {
      throw new AppError(404, 'Loyalty account not found');
    }

    if (loyalty.points < points) {
      throw new AppError(400, 'Insufficient points for redemption');
    }

    loyalty.points -= points;
    loyalty.lastRedeemDate = new Date();
    await loyalty.save();

    // Create transaction log
    const transaction = new LoyaltyTransaction({
      loyaltyId: loyalty._id,
      type: 'redeem',
      points,
      description,
    });
    await transaction.save();

    loyalty.transactions.push(transaction._id);
    await loyalty.save();

    res.status(200).json({
      success: true,
      message: 'Points redeemed successfully',
      data: loyalty,
    });
  } catch (error) {
    throw error;
  }
};

export const getLoyaltyTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { limit = 20, page = 1 } = req.query;

    const loyalty = await UserLoyalty.findOne({ userId });
    if (!loyalty) {
      throw new AppError(404, 'Loyalty account not found');
    }

    const skip = ((Number(page) - 1) * Number(limit)) as number;

    const transactions = await LoyaltyTransaction.find({ loyaltyId: loyalty._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await LoyaltyTransaction.countDocuments({ loyaltyId: loyalty._id });

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const checkBirthdayBonus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const loyalty = await UserLoyalty.findOne({ userId });
    if (!loyalty || !loyalty.birthDate) {
      throw new AppError(404, 'Birthday not set');
    }

    const today = new Date();
    const isBirthday =
      today.getDate() === loyalty.birthDate.getDate() &&
      today.getMonth() === loyalty.birthDate.getMonth();

    if (isBirthday) {
      loyalty.points += 500; // Birthday bonus
      await loyalty.save();

      const transaction = new LoyaltyTransaction({
        loyaltyId: loyalty._id,
        type: 'earn',
        points: 500,
        description: 'Birthday Bonus',
      });
      await transaction.save();
    }

    res.status(200).json({
      success: true,
      isBirthday,
      message: isBirthday ? 'Birthday bonus applied!' : 'Not today',
    });
  } catch (error) {
    throw error;
  }
};

export const getLoyaltyStats = async (req: Request, res: Response) => {
  try {
    const totalMembers = await UserLoyalty.countDocuments();

    const tierDistribution = await UserLoyalty.aggregate([
      { $group: { _id: '$tier', count: { $sum: 1 } } },
    ]);

    const totalPointsDistributed = await UserLoyalty.aggregate([
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]);

    const avgPointsPerUser = await UserLoyalty.aggregate([
      { $group: { _id: null, avg: { $avg: '$points' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        tierDistribution,
        totalPointsDistributed: totalPointsDistributed[0]?.total || 0,
        avgPointsPerUser: avgPointsPerUser[0]?.avg || 0,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch loyalty stats');
  }
};
