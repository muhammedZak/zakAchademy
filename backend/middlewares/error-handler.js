exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  const message = err.message;

  res.status(err.statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
