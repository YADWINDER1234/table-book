import mongoose, { Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  peakHour: string;
  tablesUtilization: number;
  averageGuestSize: number;
}

const analyticsSchema = new mongoose.Schema<IAnalytics>(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    completedBookings: {
      type: Number,
      default: 0,
    },
    cancelledBookings: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    peakHour: {
      type: String,
      default: '',
    },
    tablesUtilization: {
      type: Number,
      default: 0,
    },
    averageGuestSize: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
