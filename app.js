const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();

const mongoose = require('mongoose');

const helmet = require('helmet');

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

app.use('/', rootRouter);
app.use(errorLogger);

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Ура! Заработало! Порт:${PORT}`);
});
