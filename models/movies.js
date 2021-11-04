const mongoose = require('mongoose');
const validator = require('validator');
const {
  movieInvalidPhotoLink,
  movieInvalidTrailerLink,
  movieInvalidthumbnailLink,
  validatorCheckLangRu,
  validatorCheckLangEng,
} = require('../errors/messages');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,

  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    length: 4,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => {
        if (!validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true })) {
          throw new Error(movieInvalidPhotoLink);
        }
        return link;
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (link) => {
        if (!validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true })) {
          throw new Error(movieInvalidTrailerLink);
        }
        return link;
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => {
        if (!validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true })) {
          throw new Error(movieInvalidthumbnailLink);
        }
        return link;
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        if (!validator.isAlphanumeric(value, 'ru-RU', { ignore: ' .,!?@#$%@&*"' })) {
          throw new Error(validatorCheckLangRu);
        }
        return value;
      },
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        if (!validator.isAlphanumeric(value, 'en-US', { ignore: ' .,!?@#$%@&*"' })) {
          throw new Error(validatorCheckLangEng);
        }
        return value;
      },
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
