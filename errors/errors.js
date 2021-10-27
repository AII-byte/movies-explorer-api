const errorsHandler = (err, req, res, next) => {
  const status = err.statusCode;
  const { message } = err.message;

  res.status(status).send({ message });

  next();
};

module.exports = errorsHandler;
