import { verifyToken } from '../utils';
import { AuthenticationError } from '../exceptions';

export const authenticateUser = (req, res, next) => {
  try {
    let token =
      req.headers.authorization &&
      (req.headers.authorization.split(' ')[1] || req.headers.authorization);

    if (req.query.token) token = req.query.token;

    if (!token) {
      throw new AuthenticationError('Please provide a token');
    }

    const decoded = verifyToken(token);

    req.locals = decoded;

    next();
  } catch (err) {
    next(err);
  }
};
