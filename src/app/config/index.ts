import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  db_url: process.env.DB_URL,
  port: process.env.PORT,

  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  smtp_email: process.env.SMTP_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  admin_email: process.env.ADMIN_EMAIL,
  cloudinary_cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDNARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDNARY_API_SECRET,
  resend_key: process.env.RESEND_KEY,
};
