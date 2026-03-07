import { Model } from 'mongoose';

export interface IBullet {
  heading: string;
  text: string;
}

export interface IProductItem {
  id: string; // From your data: "1", "2", etc.
  title: string;
  description: string;
  image: string;
}

export interface IProductCategory {
  hero: {
    title: string;
    description: string;
    image: string;
  };
  details: {
    title: string;
    intro: string;
    bullets: IBullet[];
    image1: { src: string; name: string };
    image2: { src: string; name: string };
  };
  products: IProductItem[];
  isActive: boolean;
  displayOrder: number;
}

// For Mongoose Document methods if needed
export type ProductModel = Model<IProductCategory>;
