import logger from '../utils';

const defaultErrorHandler = app =>
  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).send({
      status: 'error',
      error: statusCode === 500 ? 'Internal Server Error' : error.message,
    });

    app.get('env') !== 'production' && logger(`Error:server`, error.stack);
  });

export default defaultErrorHandler;
