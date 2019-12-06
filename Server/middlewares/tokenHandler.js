import { verifyToken } from '../utils';

export const authenticateUser = (req, res, next) => {
  try {
    const err = 'Please provide a token';

    if (!req.headers.authorization) throw err;

    const token =
      req.headers.authorization.split(' ')[1] || req.headers.authorization;

    const decoded = verifyToken(token);

    req.decoded = decoded;
    next();
  } catch (err) {
    const error = err.message ? 'Authentication Failed' : err;

    next(error);
  }
};

export default verifyToken;
