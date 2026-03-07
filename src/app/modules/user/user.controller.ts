import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uerService } from "./user.service";

const login = catchAsync(async (req, res) => {
  const result = await uerService.login(req.body)
  sendResponse(res, {
    message: 'login successfull',
    success: true,
    data: result,
    statusCode: status.OK
  })
})

const changePassword = catchAsync(async (req, res) => {
  const user = req?.user
  console.log({user})
  const result = await uerService.changePassword(req.body, user?.email)
  sendResponse(res, {
    message: 'Password changed successfull',
    success: true,
    data: result,
    statusCode: status.OK
  })
})
const forgetPassword = catchAsync(async (req, res) => {
  const result = await uerService.forgotPassword(req.body)
  sendResponse(res, {
    message: 'Please check you email',
    success: true,
    data: result,
    statusCode: status.OK
  })
})
const otpVerified = catchAsync(async (req, res) => {
  const {email, otp} = req.body
  const result = await uerService.verifyOtp(email, otp)
  sendResponse(res, {
    message: 'Otp verified successfull',
    success: true,
    data: result,
    statusCode: status.OK
  })
})
const resetPassword = catchAsync(async (req, res) => {
  const result = await uerService.resetPassword(req.body)
  sendResponse(res, {
    message: 'login successfull',
    success: true,
    data: result,
    statusCode: status.OK
  })
})

export const userController = {
  login,
  changePassword,
  forgetPassword,
  otpVerified,
  resetPassword
}