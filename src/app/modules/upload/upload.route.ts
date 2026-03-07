import { Router } from "express";
import { upload } from "../../middlewares/upload.middleware";
import { uploadController } from "./upload.controller";

const route = Router()

route.post('/', upload.single('image'), uploadController.uploadImage)

export const uploadRoute = route