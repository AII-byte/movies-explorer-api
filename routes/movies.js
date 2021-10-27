const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserMovie,
  createUserMovie,
  deleteUserMovie,
//  likeCard,
//  dislikeCard,
} = require('../controllers/movies');

router.get('/', getUserMovie);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.string().required().min(2).max(30),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().min(2).max(30),
    trailer: Joi.string().required().min(2).max(30),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    thumbnail: Joi.string().required().min(2).max(30),
    moveId: Joi.string().length(24).hex(),
  }),
}), createUserMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteUserMovie);

/*
router.put('/:movieId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);

router.delete('/:movieId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);
*/

module.exports = router;
