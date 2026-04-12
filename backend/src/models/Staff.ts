import mongoose, { Document } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  email: string;
  phone: string;
  role: 'Host' | 'Waiter' | 'Chef' | 'Manager' | 'Admin';
  department: 'Front of House' | 'Kitchen' | 'Management';
  employmentDate: Date;
  salary?: number;
  availability?: {
    day: string; // "Monday" to "Sunday"
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
  }[];
  performance: {
    rating?: number;
    totalReviews?: number;
    commendations?: string[];
  };
  shirtsSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  emergencyContact?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new mongoose.Schema<IStaff>(
  {
    name: {
      type: String,
      required: [true, 'Staff name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    role: {
      type: String,
      enum: ['Host', 'Waiter', 'Chef', 'Manager', 'Admin'],
      required: [true, 'Role is required'],
    },
    department: {
      type: String,
      enum: ['Front of House', 'Kitchen', 'Management'],
      required: [true, 'Department is required'],
    },
    employmentDate: {
      type: Date,
      required: [true, 'Employment date is required'],
    },
    salary: {
      type: Number,
      default: 0,
    },
    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    performance: {
      rating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      commendations: [String],
    },
    shirtsSize: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    emergencyContact: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.index({ email: 1 });
staffSchema.index({ role: 1 });
staffSchema.index({ isActive: 1 });

export default mongoose.model<IStaff>('Staff', staffSchema);
