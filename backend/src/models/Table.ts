import mongoose, { Document } from 'mongoose';

export interface ITable extends Document {
  tableNumber: number;
  capacity: number;
  location: 'window' | 'patio' | 'indoor' | 'private';
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tableSchema = new mongoose.Schema<ITable>(
  {
    tableNumber: {
      type: Number,
      required: [true, 'Table number is required'],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      enum: [2, 4, 6, 8],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: ['window', 'patio', 'indoor', 'private'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITable>('Table', tableSchema);
