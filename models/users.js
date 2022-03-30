const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Error400 = require('../errors/error400');
const {
  userLoginError,
  userEmailIncorrect,
} = require('../errors/messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value, { require_protocol: true })) {
        throw new Error({ error: userEmailIncorrect });
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
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
        return Promise.reject(new Error400(userLoginError));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error400(userLoginError));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
