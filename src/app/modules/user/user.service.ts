import status from 'http-status';
import ApppError from '../../error/AppError';
import { IChangePassowrd, ILogin } from './user.interface';
import User from './user.model';
import { decodeToken, generateToken } from '../../utils/generateToken';
import config from '../../config';
import Otp from '../otp/otp.model';
import { EOtpType } from '../otp/otp.interface';
import { sendEmail } from '../../utils/sendEmail';
import cron from 'node-cron';
import { JwtPayload } from 'jsonwebtoken';
import { passwordUtils } from '../../utils/hashPassword';
const login = async (payload: ILogin) => {
  const isUserExist = await User.findOne({ email: payload?.email }).select(
    '+password',
  );
  console.log({ isUserExist });
  if (!isUserExist) {
    throw new ApppError(status.NOT_FOUND, 'User not found');
  }
  const isPasswordCorrect = await passwordUtils.verifyPassword(
    payload.password,
    isUserExist.password,
  );
  if (!isPasswordCorrect) {
    throw new ApppError(status.CONFLICT, 'Incorrect password');
  }
  const accessToken = generateToken(
    { id: isUserExist.id, role: isUserExist.role, email: isUserExist?.email },
    config.access_token_secret as string,
    '1h',
  );
  return accessToken;
};

const changePassword = async (payload: IChangePassowrd, email: string) => {
  console.log({ payload });
  const isUserExist = await User.findOne({ email }).select('+password');
  if (!isUserExist) {
    throw new ApppError(status.NOT_FOUND, 'User not found');
  }
  console.log({ isUserExist });

  const isOldPasswordMatch = await passwordUtils.verifyPassword(
    payload.oldPassword,
    isUserExist.password,
  );
  if (!isOldPasswordMatch) {
    throw new ApppError(status.CONFLICT, 'Incorrect old password');
  }

  const newPassword = await passwordUtils.hashPassword(payload?.newPassword);
  const result = await User.findByIdAndUpdate(
    isUserExist?.id,
    { password: newPassword },
    { new: true },
  );
  return result;
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new ApppError(
      status.NOT_FOUND,
      'User with this email does not exist',
    );
  }
  console.log({ user });
  // 1. Generate a 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Hash the OTP for secure storage
  const codeHash = await passwordUtils.hashPassword(otpCode);

  await Otp.deleteMany({ userId: user.id, type: EOtpType.PASSWORD_RESET });
  // 3. Save to Database (Set expiry for 10 minutes)
  await Otp.create({
    userId: user.id,
    codeHash,
    type: EOtpType.PASSWORD_RESET,
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
  const result = await sendEmail(user.email, 'Your Password Reset Code', html);
  console.log({ result });
  return { message: 'OTP sent to email' };
};

const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApppError(status.NOT_FOUND, 'User not found');

  const otpData = await Otp.findOne({
    userId: user._id,
    type: EOtpType.PASSWORD_RESET,
    used: false,
  }).sort({ createdAt: -1 });

  if (!otpData)
    throw new ApppError(status.BAD_REQUEST, 'OTP not found or expired');

  if (new Date() > otpData.expiresAt) {
    throw new ApppError(status.GONE, 'OTP has expired');
  }
  const isMatch = await passwordUtils.verifyPassword(otpData.codeHash, otp);
  if (!isMatch) {
    await Otp.findByIdAndUpdate(otpData._id, { $inc: { attempts: 1 } });
    throw new ApppError(status.UNAUTHORIZED, 'Invalid OTP');
  }

  otpData.used = true;
  await otpData.save();

  const token = generateToken(
    { id: user.id, email: user.email, purpose: 'password_reset' },
    config.access_token_secret as string,
    '15m',
  );

  return { token };
};

const resetPassword = async (payload: { password: string; token: string }) => {
  const decoded = decodeToken(
    payload.token,
    config.access_token_secret as string,
  ) as JwtPayload;
  const user = await User.findById(decoded?.id);
  if (!user) throw new ApppError(status.NOT_FOUND, 'User not found');

  const hashedPassword = await passwordUtils.hashPassword(payload.password);

  await User.findByIdAndUpdate(
    user.id,
    { password: hashedPassword },
    { new: true },
  );
  await Otp.deleteMany({ userId: user.id, type: EOtpType.PASSWORD_RESET });

  return { message: 'Password reset successful' };
};

cron.schedule('*/30 * * * *', async () => {
  try {
    console.log('--- Running OTP Cleanup Job ---');

    const now = new Date();

    const result = await Otp.deleteMany({
      $or: [{ expiresAt: { $lt: now } }, { used: true }],
    });

    console.log(
      `Successfully cleaned up ${result.deletedCount} unnecessary OTPs.`,
    );
  } catch (error) {
    console.error('Error during OTP cleanup cron job:', error);
  }
});

export const uerService = {
  login,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
