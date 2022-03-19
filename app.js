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

const corsOptions = {
  origin: [
    'http://51.250.20.199',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'https://aii.nomoredomains.work',
    'http://aii.nomoredomains.work',
    'https://api.aii.nomoredomains.work',
    'http://api.aii.nomoredomains.work',
  ],
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/', rootRouter);
app.use(errorLogger);

app.use(errors());
app.use(errorsHandler);

app.listen(port, () => {
  console.log(`Ура! Заработало! Порт:${port}`);
});
