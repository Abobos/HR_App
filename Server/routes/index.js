import { Router } from 'express';

const indexRoute = Router();

indexRoute.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the API',
  });
});

export default indexRoute;
