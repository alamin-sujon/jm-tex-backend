import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bannerServices } from "./banner.service";

const createBanner = catchAsync(async (req, res) => {
  const result = await bannerServices.createBanner(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Banner created successfully',
    data: result
  })
})

const getAllBanner = catchAsync(async (req, res) => {
  const result = await bannerServices.getAllBanner()
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Banners retrived successfully',
    data: result,
  });
})
const getSingleBanner = catchAsync(async (req, res) => {
  const { bannerId } = req.params 
  const result = await bannerServices.getSingleBanner(bannerId)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Banner retrived successfully',
    data: result,
  });
})
const updateBanner = catchAsync(async (req, res) => {
  const { bannerId } = req.params 
  const result = await bannerServices.updateBanner(bannerId, req.body)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  });
})
const deleteBanner = catchAsync(async (req, res) => {
  const { bannerId } = req.params 
  const result = await bannerServices.deleteBanner(bannerId)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  });
})

export const bannerController = {
  createBanner,
  getAllBanner,
  getSingleBanner,
  updateBanner,
  deleteBanner
}