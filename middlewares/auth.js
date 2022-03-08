require('dotenv').config();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const Error401 = require('../errors/error401');
const { authorizationError } = require('../errors/messages');

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new Error401(authorizationError);
  }
  req.user = payload;
  next();
}

module.exports = auth;
