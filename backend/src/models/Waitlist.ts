import mongoose, { Document } from 'mongoose';

export interface IWaitlist extends Document {
  userId: mongoose.Types.ObjectId;
  requestedDate: Date;
  partySize: number;
  status: 'waiting' | 'notified' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const waitlistSchema = new mongoose.Schema<IWaitlist>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedDate: {
      type: Date,
      required: [true, 'Requested date is required'],
    },
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      min: [1, 'Minimum 1 guest required'],
    },
    status: {
      type: String,
      enum: ['waiting', 'notified', 'expired'],
      default: 'waiting',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
waitlistSchema.index({ requestedDate: 1, status: 1 });
waitlistSchema.index({ userId: 1 });

export default mongoose.model<IWaitlist>('Waitlist', waitlistSchema);
