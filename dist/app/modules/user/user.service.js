"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
const generateToken_1 = require("../../utils/generateToken");
const config_1 = __importDefault(require("../../config"));
const otp_model_1 = __importDefault(require("../otp/otp.model"));
const otp_interface_1 = require("../otp/otp.interface");
const sendEmail_1 = require("../../utils/sendEmail");
const node_cron_1 = __importDefault(require("node-cron"));
const hashPassword_1 = require("../../utils/hashPassword");
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.default.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select('+password');
    console.log({ isUserExist });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isPasswordCorrect = yield hashPassword_1.passwordUtils.verifyPassword(payload.password, isUserExist.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Incorrect password');
    }
    const accessToken = (0, generateToken_1.generateToken)({ id: isUserExist.id, role: isUserExist.role, email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email }, config_1.default.access_token_secret, '1h');
    return accessToken;
});
const changePassword = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ payload });
    const isUserExist = yield user_model_1.default.findOne({ email }).select('+password');
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    console.log({ isUserExist });
    const isOldPasswordMatch = yield hashPassword_1.passwordUtils.verifyPassword(payload.oldPassword, isUserExist.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Incorrect old password');
    }
    const newPassword = yield hashPassword_1.passwordUtils.hashPassword(payload === null || payload === void 0 ? void 0 : payload.newPassword);
    const result = yield user_model_1.default.findByIdAndUpdate(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id, { password: newPassword }, { new: true });
    return result;
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User with this email does not exist');
    }
    console.log({ user });
    // 1. Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // 2. Hash the OTP for secure storage
    const codeHash = yield hashPassword_1.passwordUtils.hashPassword(otpCode);
    yield otp_model_1.default.deleteMany({ userId: user.id, type: otp_interface_1.EOtpType.PASSWORD_RESET });
    // 3. Save to Database (Set expiry for 10 minutes)
    yield otp_model_1.default.create({
        userId: user.id,
        codeHash,
        type: otp_interface_1.EOtpType.PASSWORD_RESET,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background-color: #ffffff; border: 1px solid #ddd;">
          
          <tr>
            <td style="background-color: #3d5a6c; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 2px; text-transform: uppercase;">
                Hats Master
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px; color: #333; line-height: 1.6;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111;">Verify Your Account</h2>
              <p style="margin: 0 0 25px 0; font-size: 14px;">
                Use the code below to complete your verification. This code will expire in 
                <strong style="color: #111;">10 minutes</strong>.
              </p>

              <div style="text-align: center; background-color: #f9f9f9; padding: 30px; border-radius: 4px; border: 1px dashed #3d5a6c; margin-bottom: 25px;">
                <div style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Your Code</div>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3d5a6c;">
                  ${otpCode}
                </div>
              </div>

              <p style="margin: 0; font-size: 12px; color: #777; text-align: center;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #333333; padding: 20px; text-align: center; color: #ffffff; font-size: 11px; letter-spacing: 0.5px;">
              Copyright &copy; ${new Date().getFullYear()} | Hats Master Official
              <br>
              <span style="color: #888; display: inline-block; margin-top: 5px;">This is an automated message, please do not reply.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
    // 4. Send Email
    const result = yield (0, sendEmail_1.sendEmail)(user.email, 'Your Password Reset Code', html);
    console.log({ result });
    return { message: 'OTP sent to email' };
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    const otpData = yield otp_model_1.default.findOne({
        userId: user._id,
        type: otp_interface_1.EOtpType.PASSWORD_RESET,
        used: false,
    }).sort({ createdAt: -1 });
    if (!otpData)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'OTP not found or expired');
    if (new Date() > otpData.expiresAt) {
        throw new AppError_1.default(http_status_1.default.GONE, 'OTP has expired');
    }
    const isMatch = yield hashPassword_1.passwordUtils.verifyPassword(otpData.codeHash, otp);
    if (!isMatch) {
        yield otp_model_1.default.findByIdAndUpdate(otpData._id, { $inc: { attempts: 1 } });
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid OTP');
    }
    otpData.used = true;
    yield otpData.save();
    const token = (0, generateToken_1.generateToken)({ id: user.id, email: user.email, purpose: 'password_reset' }, config_1.default.access_token_secret, '15m');
    return { token };
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, generateToken_1.decodeToken)(payload.token, config_1.default.access_token_secret);
    const user = yield user_model_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    const hashedPassword = yield hashPassword_1.passwordUtils.hashPassword(payload.password);
    yield user_model_1.default.findByIdAndUpdate(user.id, { password: hashedPassword }, { new: true });
    yield otp_model_1.default.deleteMany({ userId: user.id, type: otp_interface_1.EOtpType.PASSWORD_RESET });
    return { message: 'Password reset successful' };
});
node_cron_1.default.schedule('*/30 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('--- Running OTP Cleanup Job ---');
        const now = new Date();
        const result = yield otp_model_1.default.deleteMany({
            $or: [{ expiresAt: { $lt: now } }, { used: true }],
        });
        console.log(`Successfully cleaned up ${result.deletedCount} unnecessary OTPs.`);
    }
    catch (error) {
        console.error('Error during OTP cleanup cron job:', error);
    }
}));
exports.uerService = {
    login,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
};
