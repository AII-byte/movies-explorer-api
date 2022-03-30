const router = require('express').Router();

const { validateCreateUser, validateLoginUser } = require('../middlewares/validations');
const { createUser, login } = require('../controllers/users');
const { pageCannotFound } = require('../errors/messages');

const userRouter = require('./users');
const moviesRouter = require('./movies');
const Error404 = require('../errors/error404');
const auth = require('../middlewares/auth');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, login);
router.use(auth);
router.post('/signout');
router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use('*', () => { throw new Error404(pageCannotFound); });

module.exports = router;
