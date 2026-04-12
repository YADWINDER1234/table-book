import mongoose, { Document } from 'mongoose';

export interface IGroupEvent extends Document {
  eventId: string;
  eventName: string;
  organizerId: mongoose.Types.ObjectId;
  bookingIds: mongoose.Types.ObjectId[]; // Multiple bookings for group
  description?: string;
  eventDate: Date;
  eventType: 'Corporate' | 'Wedding' | 'Birthday' | 'Conference' | 'Other';
  estimatedGuests: number;
  totalTables: number;
  specialRequirements?: string;
  dedicatedCoordinator?: mongoose.Types.ObjectId; // Staff ID
  customMenu?: mongoose.Types.ObjectId; // Link to menu
  budget?: number;
  status: 'enquiry' | 'proposed' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventPackage extends Document {
  name: string;
  description: string;
  minGuests: number;
  maxGuests: number;
  pricePerHead: number;
  inclusions: string[];
  duration: number; // hours
  decorOptions?: boolean;
  musicOptions?: boolean;
  customMenuAvailable?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const groupEventSchema = new mongoose.Schema<IGroupEvent>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    description: String,
    eventDate: {
      type: Date,
      required: true,
    },
    eventType: {
      type: String,
      enum: ['Corporate', 'Wedding', 'Birthday', 'Conference', 'Other'],
      required: true,
    },
    estimatedGuests: {
      type: Number,
      required: true,
      min: 10, // minimum for group booking
    },
    totalTables: {
      type: Number,
      required: true,
    },
    specialRequirements: String,
    dedicatedCoordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    customMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    budget: Number,
    status: {
      type: String,
      enum: ['enquiry', 'proposed', 'confirmed', 'completed', 'cancelled'],
      default: 'enquiry',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

const eventPackageSchema = new mongoose.Schema<IEventPackage>(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
    },
    description: {
      type: String,
      required: true,
    },
    minGuests: {
      type: Number,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    pricePerHead: {
      type: Number,
      required: true,
      min: 0,
    },
    inclusions: {
      type: [String],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    decorOptions: {
      type: Boolean,
      default: false,
    },
    musicOptions: {
      type: Boolean,
      default: false,
    },
    customMenuAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

groupEventSchema.index({ organizerId: 1, eventDate: -1 });
groupEventSchema.index({ status: 1 });
eventPackageSchema.index({ pricePerHead: 1 });

export const GroupEvent = mongoose.model<IGroupEvent>('GroupEvent', groupEventSchema);
export const EventPackage = mongoose.model<IEventPackage>('EventPackage', eventPackageSchema);
