import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../exceptions';

export const createToken = payload => {
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '24h',
  });
  return token;
};

export const verifyToken = token => {
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_KEY);
    return verifiedToken;
  } catch (e) {
    throw new AuthenticationError('Authentication Failed');
  }
};
