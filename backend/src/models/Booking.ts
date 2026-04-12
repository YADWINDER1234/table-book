import mongoose, { Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  userId: mongoose.Types.ObjectId;
  tableId: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  experienceType: 'Dining' | 'Tasting Menu' | 'Private Room';
  specialOccasion?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
    },
    guestPhone: {
      type: String,
      required: [true, 'Guest phone is required'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Minimum 1 guest required'],
      max: [12, 'Maximum 12 guests allowed'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    durationMinutes: {
      type: Number,
      default: 90,
      min: [30, 'Minimum duration is 30 minutes'],
      max: [480, 'Maximum duration is 8 hours'],
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    experienceType: {
      type: String,
      enum: ['Dining', 'Tasting Menu', 'Private Room'],
      default: 'Dining',
    },
    specialOccasion: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ tableId: 1, bookingDate: -1 });
bookingSchema.index({ status: 1, bookingDate: -1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
