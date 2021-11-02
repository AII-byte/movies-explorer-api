const router = require('express').Router();

const { validateEditInfoUser } = require('../middlewares/validations');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validateEditInfoUser, updateUser);

module.exports = router;
