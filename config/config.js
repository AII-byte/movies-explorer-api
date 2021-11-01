const rateLimit = require('express-rate-limit');

const port = process.env.PORT;

const dbAddress = 'mongodb://localhost:27017/moviesdb';

const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
});

module.exports = {
  port,
  limiter,
  dbAddress,
};
