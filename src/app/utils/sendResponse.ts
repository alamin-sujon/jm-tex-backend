import { Response } from 'express';

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data?.statusCode).json({
    success: data?.success,
    statusCode: data?.statusCode,
    message: data?.message,
    data: data?.data,
    meta: data?.meta
  });
};

export default sendResponse;
