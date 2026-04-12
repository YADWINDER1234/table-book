import mongoose, { Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages' | 'Specials';
  price: number;
  image?: string;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  allergens?: string[];
  availability: boolean;
  preparationTime?: number; // in minutes
  spicyLevel?: 0 | 1 | 2 | 3; // 0-3 scale
  ratings?: number; // average rating
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new mongoose.Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Specials'],
      required: [true, 'Category is required'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: null,
    },
    dietary: {
      vegetarian: { type: Boolean, default: false },
      vegan: { type: Boolean, default: false },
      glutenFree: { type: Boolean, default: false },
      dairyFree: { type: Boolean, default: false },
    },
    allergens: {
      type: [String],
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      default: 20,
    },
    spicyLevel: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

menuItemSchema.index({ category: 1, availability: 1 });

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
