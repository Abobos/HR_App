import { Router } from 'express';

import authRoute from '../routes/auth';
import templateRoute from '../routes/template';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the HR API',
  });
});

router.use('/api/v1/auth', authRoute);
router.use('/api/v1', templateRoute);

router.all('/*', (req, res) => {
  res.status(400).send({
    status: 'error',
    error: 'This route is unavailable on the server',
  });
});

export default router;
