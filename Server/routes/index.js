import { Router } from 'express';

import authRoute from '../routes/auth';

import { NotFoundError } from '../exceptions';

const router = Router();

router.use('/api/v1/auth', authRoute);

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the HR API',
  });
});

router.all('/*', (req, res) => {
  throw new NotFoundError('This route is unavailable on the server');
});

export default router;
