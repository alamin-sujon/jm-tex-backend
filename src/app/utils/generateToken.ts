import jwt, { Secret } from 'jsonwebtoken';
import ms from 'ms';
export const generateToken = async (
  payload: object,
  secret: string,
  expiresIn: ms.StringValue,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  return token;
};

export const decodeToken = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null; // Handle invalid token gracefully
  }
};
