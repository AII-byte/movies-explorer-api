const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');
const Error500 = require('../errors/error500');

const { NODE_ENV } = process.env;

const { JWT_SECRET = 'secret' } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные при создании пользователя.'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error409('Пользователь с данным email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).end(res.send({ message: 'Пользователь залогинен' }));
    })
    .catch(() => next(new Error401('Пароль или email введен неверно')));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new Error404('Пользователь с указанным ID не найден.'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные при запросе данных пользователя.'));
      }
      return next(new Error500('Запрашиваемый ресурс не найден.'));
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name } = req.body;
  User.findByIdAndUpdate(
    userId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        throw new Error404('Пользователь с указанным ID не найден.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные при обновлении информации о пользователе.'));
      } else {
        next(new Error500({ err }));
      }
    });
};

module.exports = {
  login,
  createUser,
  updateUser,
  getCurrentUser,
};
