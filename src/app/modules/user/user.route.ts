import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";

const route = Router()

route.post('/login', userController.login)

route.post('/change-password',auth('admin', 'user'), userController.changePassword)
route.post('/forget-password', userController.forgetPassword)
route.post('/verify-otp', userController.otpVerified)
route.post('/reset-password', userController.resetPassword)
export const userRoute = route