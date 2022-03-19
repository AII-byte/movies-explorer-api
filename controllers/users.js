const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/config');

const User = require('../models/users');

const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');

const {
  userCreateIncorrectData,
  userEmailConflict,
  userLoginError,
  userCannotFoundViaId,
  userIncorrectUpdateInfo,
  userIncorrectRequest,
} = require('../errors/messages');

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .orFail(new Error404(userCannotFoundViaId))
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new Error400(userIncorrectRequest));
    } else {
      next(err);
    }
  });

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400(userCreateIncorrectData));
      }
      if (err.code === 11000) {
        next(new Error409(userEmailConflict));
      }
      next(err);
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    userId,
    {
      name, email,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        throw new Error404(userCannotFoundViaId);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new Error400(userIncorrectUpdateInfo));
      } else {
        next(new Error409(userEmailConflict));
      }
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });
      res
        .status(200).send({ token });
    })
    .catch(() => next(new Error401(userLoginError)));
};

module.exports = {
  login,
  createUser,
  updateUser,
  getCurrentUser,
};
