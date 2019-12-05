import logger from '../utils';

const defaultErrorHandler = app =>
  app.use((error, req, res, next) => {
    process.env.NODE_ENV !== 'production' &&
      (error.statusCode === 500 && logger(`Error:server`, error.stack));

    res.status(error.statusCode).send({
      status: 'error',
      error: error.statusCode === 500 ? 'Internal Server Error' : error.message
    });
  });

export default defaultErrorHandler;
