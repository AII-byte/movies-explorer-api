const Movie = require('../models/movies');

const Error400 = require('../errors/error400');
const Error403 = require('../errors/error403');
const Error404 = require('../errors/error404');
const Error500 = require('../errors/error500');

const getUserMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      if (!movie) {
        next(new Error404('Карточка с указанным ID не найдена.'));
      } else {
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные при запросе карточек.'));
      } else {
        next(new Error500('Запрашиваемый ресурс не найден.'));
      }
    });
};

const createUserMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные при создании карточки.'));
      } else {
        next(new Error500({ err }));
      }
    });
};

const deleteUserMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(movie.owner)) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => {
            res.send(deletedMovie);
          });
      } else {
        next(new Error403('Вы не можете удалять чужие карточки'));
      }
    })
    .catch(() => {
      if (!Movie) {
        next(new Error400('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(new Error404('Карточка с указанным ID не найдена'));
      }
    });
};

module.exports = {
  getUserMovie,
  createUserMovie,
  deleteUserMovie,
};
