const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const app = express();

const mongoose = require('mongoose');

const helmet = require('helmet');

const cors = require('cors');

const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const errorsHandler = require('./errors/errors');

const { limiter, port, dbAddress } = require('./config/config');

const rootRouter = require('./routes');

mongoose.connect(dbAddress);

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use(express.json({ extended: true }));

app.use(cors({
  origin: ['http://aii.nomoredomains.work', 'https://aii.nomoredomains.work', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}));

app.use('/', rootRouter);
app.use(errorLogger);

app.use(errors());
app.use(errorsHandler);

app.listen(port, () => {
  console.log(`Ура! Заработало! Порт:${port}`);
});
