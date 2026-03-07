import { Types } from 'mongoose';
import { IProductCategory } from './product.interface';
import { ProductCategoryModel } from './product.model';
import AppError from '../../error/AppError'; // Fixed typo from ApppError
import status from 'http-status';

export const ProductService = {
  async create(payload: Partial<IProductCategory>) {
    const isExist = await ProductCategoryModel.exists({
      'hero.title': payload.hero?.title,
    });
    if (isExist) {
      throw new AppError(
        status.CONFLICT,
        `Category '${payload.hero?.title}' already exists`,
      );
    }

    const total = await ProductCategoryModel.countDocuments();
    const doc = await ProductCategoryModel.create({
      ...payload,
      displayOrder: total + 1,
    });
    return doc;
  },

  async findAll(query: any) {
    const { q, isActive, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    if (q) {
      filter.$or = [
        { 'hero.title': { $regex: q, $options: 'i' } },
        { 'details.title': { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      ProductCategoryModel.find(filter)
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ProductCategoryModel.countDocuments(filter),
    ]);

    return {
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
      data: items,
    };
  },

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(status.BAD_REQUEST, 'Invalid ID');
    const result = await ProductCategoryModel.findById(id);
    if (!result) throw new AppError(status.NOT_FOUND, 'Category not found');
    return result;
  },

  async update(id: string, payload: Partial<IProductCategory>) {
    const result = await ProductCategoryModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true },
    );
    if (!result) throw new AppError(status.NOT_FOUND, 'Category not found');
    return result;
  },

  async remove(id: string) {
    const result = await ProductCategoryModel.findByIdAndDelete(id);
    if (!result) throw new AppError(status.NOT_FOUND, 'Category not found');
    return result;
  },
};
