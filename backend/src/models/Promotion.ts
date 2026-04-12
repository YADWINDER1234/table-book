import mongoose, { Document } from 'mongoose';

export interface IPromotion extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount?: number; // for percentage discounts
  minOrderValue?: number;
  maxUsage: number;
  usageCount: number;
  startDate: Date;
  endDate: Date;
  applicableTiers: ('Bronze' | 'Silver' | 'Gold' | 'Platinum')[];
  applicableOn: 'booking' | 'menu' | 'both';
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId; // Admin ID
  usedBy?: mongoose.Types.ObjectId[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  refereeId?: mongoose.Types.ObjectId;
  referralCode: string;
  referralLink: string;
  status: 'pending' | 'completed';
  reward: {
    referrerPoints: number;
    refereePoints: number;
    referrerDiscount?: number;
    refereeDiscount?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const promotionSchema = new mongoose.Schema<IPromotion>(
  {
    code: {
      type: String,
      required: [true, 'Promo code is required'],
      unique: true,
      uppercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: Number,
    minOrderValue: Number,
    maxUsage: {
      type: Number,
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    applicableTiers: {
      type: [String],
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    },
    applicableOn: {
      type: String,
      enum: ['booking', 'menu', 'both'],
      default: 'both',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const referralSchema = new mongoose.Schema<IReferral>(
  {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refereeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    referralLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    reward: {
      referrerPoints: { type: Number, default: 500 },
      refereePoints: { type: Number, default: 300 },
      referrerDiscount: Number,
      refereeDiscount: Number,
    },
  },
  {
    timestamps: true,
  }
);

promotionSchema.index({ startDate: 1, endDate: 1 });
referralSchema.index({ referrerId: 1 });
referralSchema.index({ referralCode: 1 });

export const Promotion = mongoose.model<IPromotion>('Promotion', promotionSchema);
export const Referral = mongoose.model<IReferral>('Referral', referralSchema);
