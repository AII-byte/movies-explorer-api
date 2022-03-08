const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/config');

const User = require('../models/users');

const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');

const {
  userLogin,
  userLogout,
  userCreateIncorrectData,
  userEmailConflict,
  userLoginError,
  userCannotFoundViaId,
  userIncorrectUpdateInfo,
  cookieDelete,
} = require('../errors/messages');

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

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '1d' });
      return res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
          secure: true,
        }).send({ message: userLogin });
    })
    .catch(() => next(new Error401(userLoginError)));
};

const logout = (req, res) => {
  if (!req.cookies.jwt) {
    console.log('Некого разлогинивать');
  }

  const token = req.cookies.jwt;

  return res
    // .clearCookie('jwt', token)
    .cookie('jwt', token, {
      maxAge: 0,
    })
    .status(200)
    .send({ message: `${userLogout}. ${cookieDelete}` });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new Error404(userCannotFoundViaId));
      } else {
        res.status(200).send(user);
      }
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

module.exports = {
  login,
  logout,
  createUser,
  updateUser,
  getCurrentUser,
};
