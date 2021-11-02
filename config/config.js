const rateLimit = require('express-rate-limit');

const { NODE_ENV, DB_ADDRESS, JWT_SECRET } = process.env;

const port = process.env.PORT;

const devSecret = 'secret';
const dbDevAddress = 'mongodb://localhost:27017/moviesdb';

const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
});

const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : devSecret;
const dbAddress = NODE_ENV === 'production' ? DB_ADDRESS : dbDevAddress;

module.exports = {
  port,
  limiter,
  dbAddress,
  jwtSecret,
};
