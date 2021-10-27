const { celebrate, Joi } = require('celebrate');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});
const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
  }),
});
module.exports = {
  validateCreateUser,
  validateLoginUser,
};
