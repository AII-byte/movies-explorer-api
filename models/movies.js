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
          throw new Error({ error: 'Неверный формат ссылки на фотографию' });
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
          throw new Error({ error: 'Неверный формат ссылки на трейлер' });
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
          throw new Error({ error: 'Неверный формат ссылки на превью-фото фильма' });
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
    type: String,
    required: true,
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator: () => {
        if (validator.isAlphanumeric('ru-RU')) {
          throw new Error({ error: 'Введите название фильма используя русские буквы' });
        }
      },
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator: () => {
        if (validator.isAlphanumeric('en-US')) {
          throw new Error({ error: 'Введите название фильма используя английские буквы' });
        }
      },
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
