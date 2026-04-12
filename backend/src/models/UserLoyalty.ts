import mongoose, { Document } from 'mongoose';

export interface IUserLoyalty extends Document {
  userId: mongoose.Types.ObjectId;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  totalBookings: number;
  birthDate?: Date;
  joinedAt: Date;
  lastRedeemDate?: Date;
  transactions: {
    type: mongoose.Types.ObjectId;
    ref: 'LoyaltyTransaction';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoyaltyTransaction extends Document {
  loyaltyId: mongoose.Types.ObjectId;
  type: 'earn' | 'redeem' | 'expire';
  points: number;
  description: string;
  bookingId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const userLoyaltySchema = new mongoose.Schema<IUserLoyalty>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze',
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastRedeemDate: {
      type: Date,
      default: null,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoyaltyTransaction',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const loyaltyTransactionSchema = new mongoose.Schema<ILoyaltyTransaction>(
  {
    loyaltyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserLoyalty',
      required: true,
    },
    type: {
      type: String,
      enum: ['earn', 'redeem', 'expire'],
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userLoyaltySchema.index({ userId: 1 });
userLoyaltySchema.index({ tier: 1 });
loyaltyTransactionSchema.index({ loyaltyId: 1, createdAt: -1 });

export const UserLoyalty = mongoose.model<IUserLoyalty>('UserLoyalty', userLoyaltySchema);
export const LoyaltyTransaction = mongoose.model<ILoyaltyTransaction>(
  'LoyaltyTransaction',
  loyaltyTransactionSchema
);
