const sendErrorResponse = (res, code, errorMessage) =>
  res.status(code).send({
    status: 'error',
    error: errorMessage
  });

const sendSuccessResponse = (res, code, data) =>
  res.status(code).send({
    status: 'success',
    data
  });

export { sendErrorResponse, sendSuccessResponse };
