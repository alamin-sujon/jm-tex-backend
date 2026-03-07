import { ProductService } from './product.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

const create = catchAsync(async (req, res) => {
  const result = await ProductService.create(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Product Category created successfully',
    data: result,
  });
});

const findMany = catchAsync(async (req, res) => {
  const result = await ProductService.findAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product Categories retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const findById = catchAsync(async (req, res) => {
  const result = await ProductService.findById(req.params.productId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const result = await ProductService.update(req.params.productId, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  await ProductService.remove(req.params.productId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

export const ProductController = {
  create,
  findMany,
  findById,
  update,
  remove,
};
