const { celebrate, Joi } = require('celebrate');
const { checkURL, checkLangRu, checkLangEng } = require('./validatorCheck');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});
const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().integer().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(checkURL).required(),
    trailer: Joi.string().custom(checkURL).required(),
    thumbnail: Joi.string().custom(checkURL).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().custom(checkLangRu).required(),
    nameEN: Joi.string().custom(checkLangEng).required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLoginUser,
  validateCreateMovie,
  validateDeleteMovie,
};
