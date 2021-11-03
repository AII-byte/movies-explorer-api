require('dotenv').config();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const Error401 = require('../errors/error401');

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new Error401('Необходима авторизация');
  }

  req.user = payload;

  next();
}

module.exports = auth;
