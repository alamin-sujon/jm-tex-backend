import { Router } from "express";
import auth from "../../middlewares/auth";
import { bannerController } from "./banner.controller.";

const route = Router()

route.post('/', bannerController.createBanner)
route.get('/', bannerController.getAllBanner)
route.get('/:bannerId', bannerController.getSingleBanner)
route.patch('/:bannerId',  bannerController.updateBanner);
route.delete('/:bannerId',  bannerController.deleteBanner);
export const bannerRoute = route