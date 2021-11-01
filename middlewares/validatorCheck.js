const validator = require('validator');

const checkURL = (link) => {
  if (!validator.isURL(link, { require_protocol: true })) {
    throw new Error('Неверный формат ссылки');
  }
  return link;
};

const checkLangRu = (value) => {
  if (!(/[А-ЯЁа-яё]/).test(value)) {
    throw new Error('Введите название фильма используя русские буквы');
  }
  return value;
};

const checkLangEng = (value) => {
  if (!(/[A-Za-z]/).test(value)) {
    throw new Error('Введите название фильма используя английские буквы');
  }
  return value;
};

module.exports = {
  checkURL,
  checkLangRu,
  checkLangEng,
};
