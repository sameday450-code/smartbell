const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  registerValidation,
  loginValidation,
  refreshValidation,
  changePasswordValidation,
} = require('./auth.validation');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
});

router.post('/register', authLimiter, registerValidation, validate, authController.register);
router.post('/login', authLimiter, loginValidation, validate, authController.login);
router.post('/refresh', refreshValidation, validate, authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.patch('/change-password', authenticate, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
