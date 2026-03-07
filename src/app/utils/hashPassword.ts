import bcrypt from 'bcrypt';


const hashPassword = async (password: string): Promise<string> => {
  console.log({password})
  if (!password) {
    throw new Error('Password is required');
  }

  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  console.log({plainPassword, hashedPassword})
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const passwordUtils = {
  hashPassword,
  verifyPassword,
};
