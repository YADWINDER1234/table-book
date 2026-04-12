import mongoose, { Document } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  category: 'Produce' | 'Protein' | 'Dairy' | 'Pantry' | 'Beverages' | 'Other';
  quantity: number;
  unit: 'kg' | 'liter' | 'pcs' | 'boxes' | 'units';
  minThreshold: number;
  maxThreshold: number;
  supplier?: string;
  cost: number;
  expiryDate?: Date;
  lastRestocked: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventoryLog extends Document {
  itemId: mongoose.Types.ObjectId;
  type: 'add' | 'use' | 'waste' | 'adjustment';
  quantity: number;
  reason?: string;
  createdBy?: mongoose.Types.ObjectId; // Staff ID
  createdAt: Date;
}

const inventoryItemSchema = new mongoose.Schema<IInventoryItem>(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      index: true,
    },
    category: {
      type: String,
      enum: ['Produce', 'Protein', 'Dairy', 'Pantry', 'Beverages', 'Other'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      enum: ['kg', 'liter', 'pcs', 'boxes', 'units'],
      required: true,
    },
    minThreshold: {
      type: Number,
      required: true,
    },
    maxThreshold: {
      type: Number,
      required: true,
    },
    supplier: String,
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

const inventoryLogSchema = new mongoose.Schema<IInventoryLog>(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true,
    },
    type: {
      type: String,
      enum: ['add', 'use', 'waste', 'adjustment'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reason: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
  },
  {
    timestamps: true,
  }
);

inventoryItemSchema.index({ category: 1, quantity: 1 });
inventoryLogSchema.index({ itemId: 1, createdAt: -1 });

export const InventoryItem = mongoose.model<IInventoryItem>(
  'InventoryItem',
  inventoryItemSchema
);
export const InventoryLog = mongoose.model<IInventoryLog>('InventoryLog', inventoryLogSchema);
