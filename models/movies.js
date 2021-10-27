const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    // validate: {
    //   validator: (link) => {
    //     validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true });
    //   },
    // },
  },
  trailer: {
    type: String,
    required: true,
    // validate: {
    //   validator: (link) => {
    //     validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true });
    //   },
    // },
  },
  thumbnail: {
    type: String,
    required: true,
    // validate: {
    //   validator: (link) => {
    //     validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true });
    //   },
    // },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  moveId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator: (nameRU) => {
        validator.isAlphanumeric(nameRU, 'ru-RU');
      },
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator: (nameEN) => {
        validator.isAlphanumeric(nameEN, 'en-US');
      },
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
