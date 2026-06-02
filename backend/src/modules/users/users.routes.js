const router = require('express').Router();
const controller = require('./users.controller');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');

router.use(authenticate);

router.get('/', requireRole('SCHOOL_ADMIN'), controller.getUsers);
router.get('/:id', requireRole('SCHOOL_ADMIN'), controller.getUser);
router.post('/', requireRole('SCHOOL_ADMIN'), controller.createUser);
router.put('/:id', requireRole('SCHOOL_ADMIN'), controller.updateUser);
router.delete('/:id', requireRole('SCHOOL_ADMIN'), controller.deleteUser);

module.exports = router;
