const router = require('express').Router();

const {
  getUserMovie,
  createUserMovie,
  deleteUserMovie,
} = require('../controllers/movies');

const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validations');

router.get('/', getUserMovie);
router.post('/', validateCreateMovie, createUserMovie);

router.delete('/:movieId', validateDeleteMovie, deleteUserMovie);

module.exports = router;
