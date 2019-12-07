import { verifyToken } from '../utils';
import { AuthenticationError } from '../exceptions';

export const authenticateUser = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new AuthenticationError('Please provide a token');

    const token =
      req.headers.authorization.split(' ')[1] || req.headers.authorization;

    const decoded = verifyToken(token);

    req.decoded = decoded;

    next();
  } catch (err) {
    next(err);
  }
};
