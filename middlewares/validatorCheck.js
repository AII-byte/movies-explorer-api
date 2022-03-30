const validator = require('validator');
const {
  urlIncorrect,
  validatorCheckLangRu,
  validatorCheckLangEng,
} = require('../errors/messages');

const checkURL = (link) => {
  if (!validator.isURL(link, { require_protocol: true })) {
    throw new Error(urlIncorrect);
  }
  return link;
};

const checkLangRu = (value) => {
  if (!(/[А-ЯЁа-яё]/).test(value)) {
    throw new Error(validatorCheckLangRu);
  }
  return value;
};

const checkLangEng = (value) => {
  if (!(/[A-Za-z]/).test(value)) {
    throw new Error(validatorCheckLangEng);
  }
  return value;
};

module.exports = {
  checkURL,
  checkLangRu,
  checkLangEng,
};
