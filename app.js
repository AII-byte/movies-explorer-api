const express = require('express');

const app = express();

const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();

const helmet = require('helmet');

const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');

const port = process.env.PORT;

const errorsHandler = require('./errors/errors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const rootRouter = require('./routes');

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(errorsHandler);
app.use(requestLogger);
app.use(express.json({ extended: true }));

app.use('/', rootRouter);
app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(port, () => {
  console.log(`Ура! Заработало! Порт:${port}`);
});
