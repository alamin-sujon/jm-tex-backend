import status from "http-status";
import ApppError from "../../error/AppError";
import { IBanner } from "./banner.interface";
import { Banner } from "./banner.model";

const createBanner = async (payload: IBanner) => {
  const result = await Banner.create(payload)
  return result
}

const getAllBanner = async () => {
  const result = await Banner.find({})
  return result
}

const getSingleBanner = async (id: string) => {
  const result = await Banner.findById(id)
  if (!result) {
    throw new ApppError(status.NOT_FOUND, 'Banner not found');
  }
    
  return result
}
const updateBanner = async (id: string, payload: Partial<IBanner>) => {
  const isBannerExist = await Banner.findById(id)
  if (!isBannerExist) {
    throw new ApppError(status.NOT_FOUND, 'Banner not found');
  }
  const result = await Banner.findByIdAndUpdate(id, {...payload}, {new: true})
    
  return result
}
const deleteBanner = async (id: string) => {
const isBannerExist = await Banner.findById(id);
if (!isBannerExist) {
  throw new ApppError(status.NOT_FOUND, 'Banner not found');
}
  const result = await Banner.findByIdAndDelete(id)  
  return result
}

export const bannerServices = {
  createBanner,
  getAllBanner,
  getSingleBanner,
  updateBanner,
  deleteBanner
}