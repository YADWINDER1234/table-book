import mongoose, { Document } from 'mongoose';

export interface IDelivery extends Document {
  deliveryId: string;
  userId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  items: {
    menuItemId: mongoose.Types.ObjectId;
    quantity: number;
    specialInstructions?: string;
    price: number;
  }[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  recipientName: string;
  recipientPhone: string;
  deliveryNotes?: string;
  totalAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime?: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'on-way' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  specialOccasion?: {
    type: string; // 'birthday', 'anniversary', 'celebration', etc.
    recipientName?: string;
    message?: string;
  };
  emailSent: {
    confirmationEmail: boolean;
    specialOccasionEmail: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

const deliverySchema = new mongoose.Schema<IDelivery>(
  {
    deliveryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        specialInstructions: String,
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientPhone: {
      type: String,
      required: true,
    },
    deliveryNotes: String,
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 25,
    },
    estimatedDeliveryTime: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'on-way', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'partial'],
      default: 'unpaid',
    },
    specialOccasion: {
      type: {
        type: String,
      },
      recipientName: String,
      message: String,
    },
    emailSent: {
      confirmationEmail: {
        type: Boolean,
        default: false,
      },
      specialOccasionEmail: {
        type: Boolean,
        default: false,
      },
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IDelivery>('Delivery', deliverySchema);
