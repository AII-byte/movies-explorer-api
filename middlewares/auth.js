const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

const Error401 = require('../errors/error401');

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error401('Авторизация не прошла.');
  }

  req.user = payload;

  next();
}

module.exports = auth;
