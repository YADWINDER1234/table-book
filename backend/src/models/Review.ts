import mongoose, { Document } from 'mongoose';

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tableId: mongoose.Types.ObjectId;
  ratings: {
    food: number;
    service: number;
    ambiance: number;
    overall: number;
  };
  comment: string;
  images?: string[];
  verified: boolean; // verified booking
  helpful: number;
  unhelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
      index: true,
    },
    ratings: {
      food: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      service: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      ambiance: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    images: {
      type: [String],
      default: [],
      maxlength: [5, 'Maximum 5 images allowed'],
    },
    verified: {
      type: Boolean,
      default: true, // verified if booking exists
    },
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ tableId: 1, 'ratings.overall': -1 });
reviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);
