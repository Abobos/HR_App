import { logger } from '../utils';

const defaultErrorHandler = app =>
  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    app.get('env') !== 'production' &&
      statusCode === 500 && logger(`Error:server`, error.stack);

    res.status(statusCode).send({
      status: 'error',
      error: statusCode === 500 ? 'Internal Server Error' : error.message,
    });
  });

export default defaultErrorHandler;
