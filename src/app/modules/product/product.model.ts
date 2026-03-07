import { Schema, model } from 'mongoose';
import { IProductCategory, IBullet, IProductItem } from './product.interface';

const BulletSchema = new Schema<IBullet>(
  {
    heading: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const ProductItemSchema = new Schema<IProductItem>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false },
);

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    hero: {
      title: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
    },
    details: {
      title: { type: String, required: true },
      intro: { type: String, required: true },
      bullets: [BulletSchema],
      image1: {
        src: { type: String, required: true },
        name: { type: String, required: true },
      },
      image2: {
        src: { type: String, required: true },
        name: { type: String, required: true },
      },
    },
    products: [ProductItemSchema],
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number },
  },
  {
    timestamps: true,
   
  },
);

export const ProductCategoryModel = model<IProductCategory>(
  'ProductCategory',
  ProductCategorySchema,
);
