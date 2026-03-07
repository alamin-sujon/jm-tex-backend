import bcrypt from 'bcrypt';
import config from '../config';
import User from '../modules/user/user.model';
import { passwordUtils } from '../utils/hashPassword';

export const adminSeeder = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists, skipping seeding.');
      return;
    }

    const hashedPassword = await passwordUtils.hashPassword(
      config.admin_password as string,
    );

    const adminData = {
    name: 'Alamin Sujon',
      email: config.admin_email,
      phone: '+8801000000000',
      password: hashedPassword,
      role: 'admin',
    };

    const admin = await User.create(adminData);
    console.log({ admin });
    console.log('✅ Admin seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
  }
};
