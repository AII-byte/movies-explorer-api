const Movie = require('../models/movies');

const Error400 = require('../errors/error400');
const Error403 = require('../errors/error403');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');

const {
  movieCannotFoundViaId,
  movieIncorrectData,
  movieCreationIncorrectData,
  movieIdConflict,
  movieProhibitedDelete,
  movieDeleteIncorrectData,
} = require('../errors/messages');

const getUserMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      if (!movie) {
        next(new Error404(movieCannotFoundViaId));
      } else {
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new Error400(movieIncorrectData);
      }
      next(err);
    })
    .catch((err) => next(err));
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
      if (err.name === 'ValidationError') {
        next(new Error400(movieCreationIncorrectData));
        return;
      }
      if (err.code === 11000) {
        next(new Error409(movieIdConflict));
        return;
      }
      next(err);
    })
    .catch((err) => next(err));
};

const deleteUserMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (JSON.toString(req.user._id) === JSON.toString(movie.owner)) {
        movie.remove(movie._id)
          .then((deletedMovie) => {
            res.send(deletedMovie);
          });
      } else {
        next(new Error403(movieProhibitedDelete));
      }
    })
    .catch(() => {
      if (!Movie) {
        next(new Error400(movieDeleteIncorrectData));
      } else {
        next(new Error404(movieCannotFoundViaId));
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  getUserMovie,
  createUserMovie,
  deleteUserMovie,
};
