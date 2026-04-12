import { Request, Response } from 'express';
import { Promotion, Referral } from '../models/Promotion';
import { UserLoyalty } from '../models/UserLoyalty';
import { AppError } from '../utils/errors';
import crypto from 'crypto';

export const createPromoCode = async (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minOrderValue,
      maxUsage,
      startDate,
      endDate,
      applicableTiers,
      applicableOn,
    } = req.body;

    const promo = new Promotion({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      maxDiscount,
      minOrderValue,
      maxUsage,
      startDate,
      endDate,
      applicableTiers: applicableTiers || ['Bronze', 'Silver', 'Gold', 'Platinum'],
      applicableOn: applicableOn || 'both',
      createdBy: (req as any).userId,
    });

    await promo.save();

    res.status(201).json({
      success: true,
      message: 'Promo code created',
      data: promo,
    });
  } catch (error) {
    throw error;
  }
};

export const validatePromoCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = (req as any).userId;

    const promo = await Promotion.findOne({ code: code.toUpperCase() });
    if (!promo) {
      throw new AppError(404, 'Invalid promo code');
    }

    const now = new Date();
    if (promo.startDate > now || promo.endDate < now) {
      throw new AppError(400, 'Promo code has expired');
    }

    if (promo.usageCount >= promo.maxUsage) {
      throw new AppError(400, 'Promo code usage limit reached');
    }

    if (!promo.isActive) {
      throw new AppError(400, 'Promo code is inactive');
    }

    // Check user tier eligibility
    const loyalty = await UserLoyalty.findOne({ userId });
    if (loyalty && !promo.applicableTiers.includes(loyalty.tier)) {
      throw new AppError(400, `This promo is not applicable for ${loyalty.tier} tier`);
    }

    res.status(200).json({
      success: true,
      message: 'Promo code is valid',
      data: promo,
    });
  } catch (error) {
    throw error;
  }
};

export const redeemPromoCode = async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = (req as any).userId;

    const promo = await Promotion.findOne({ code: code.toUpperCase() });
    if (!promo) {
      throw new AppError(404, 'Invalid promo code');
    }

    // Check minimum order value
    if (promo.minOrderValue && orderAmount < promo.minOrderValue) {
      throw new AppError(400, `Minimum order value is ${promo.minOrderValue}`);
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (orderAmount * promo.discountValue) / 100;
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    } else {
      discount = promo.discountValue;
    }

    // Update usage
    promo.usageCount += 1;
    if (promo.usedBy) {
      promo.usedBy.push(userId);
    }
    await promo.save();

    res.status(200).json({
      success: true,
      message: 'Promo code redeemed',
      data: {
        code,
        originalAmount: orderAmount,
        discount: discount.toFixed(2),
        finalAmount: (orderAmount - discount).toFixed(2),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllPromos = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;

    let filter: any = {};
    if (isActive === 'true') filter.isActive = true;

    const promos = await Promotion.find(filter).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: promos,
      count: promos.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch promos');
  }
};

export const updatePromoCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const promo = await Promotion.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!promo) {
      throw new AppError(404, 'Promo not found');
    }

    res.status(200).json({
      success: true,
      message: 'Promo updated',
      data: promo,
    });
  } catch (error) {
    throw error;
  }
};

export const deletePromoCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const promo = await Promotion.findByIdAndDelete(id);
    if (!promo) {
      throw new AppError(404, 'Promo not found');
    }

    res.status(200).json({
      success: true,
      message: 'Promo deleted',
    });
  } catch (error) {
    throw error;
  }
};

// Referral Program
export const generateReferralLink = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const referralCode = crypto.randomBytes(6).toString('hex').toUpperCase();
    const referralLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}?ref=${referralCode}`;

    const referral = new Referral({
      referrerId: userId,
      referralCode,
      referralLink,
    });

    await referral.save();

    res.status(201).json({
      success: true,
      message: 'Referral link generated',
      data: { referralCode, referralLink },
    });
  } catch (error) {
    throw error;
  }
};

export const validateReferral = async (req: Request, res: Response) => {
  try {
    const { referralCode } = req.body;

    const referral = await Referral.findOne({ referralCode });
    if (!referral) {
      throw new AppError(404, 'Invalid referral code');
    }

    res.status(200).json({
      success: true,
      data: referral,
    });
  } catch (error) {
    throw error;
  }
};

export const completeReferral = async (req: Request, res: Response) => {
  try {
    const { referralCode } = req.body;
    const userId = (req as any).userId;

    const referral = await Referral.findOne({ referralCode });
    if (!referral) {
      throw new AppError(404, 'Invalid referral code');
    }

    referral.refereeId = userId;
    referral.status = 'completed';
    await referral.save();

    // Add rewards to both users
    const referrerLoyalty = await UserLoyalty.findOne({ userId: referral.referrerId });
    const refereeLoyalty = await UserLoyalty.findOne({ userId });

    if (referrerLoyalty) {
      referrerLoyalty.points += referral.reward.referrerPoints;
      await referrerLoyalty.save();
    }

    if (refereeLoyalty) {
      refereeLoyalty.points += referral.reward.refereePoints;
      await refereeLoyalty.save();
    }

    res.status(200).json({
      success: true,
      message: 'Referral completed and rewards applied',
      data: referral,
    });
  } catch (error) {
    throw error;
  }
};

export const getPromoStats = async (req: Request, res: Response) => {
  try {
    const totalPromos = await Promotion.countDocuments();
    const activePromos = await Promotion.countDocuments({ isActive: true });

    const mostUsedPromos = await Promotion.find()
      .sort({ usageCount: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalPromos,
        activePromos,
        mostUsedPromos,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch promo stats');
  }
};
