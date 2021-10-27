const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Error400 = require('../errors/error400');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value, { require_protocol: true })) {
        throw new Error({ error: 'Неверный формат email адреса' });
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error400('Пароль или email указаны неверно.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error400('Пароль или email указаны неверно.'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
