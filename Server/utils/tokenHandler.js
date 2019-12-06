import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const createToken = payload => {
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '24h',
  });
  return token;
};

export const verifyToken = token => {
  const verifiedToken = jwt.verify(token, process.env.JWT_KEY);
  return verifiedToken;
};
