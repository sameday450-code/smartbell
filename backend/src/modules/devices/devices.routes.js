const router = require('express').Router();
const controller = require('./devices.controller');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');

router.use(authenticate);

router.get('/', controller.getDevices);
router.post('/', requireRole('SCHOOL_ADMIN'), controller.registerDevice);
router.get('/:id', controller.getDevice);
router.put('/:id', requireRole('SCHOOL_ADMIN'), controller.updateDevice);
router.delete('/:id', requireRole('SCHOOL_ADMIN'), controller.deleteDevice);

module.exports = router;
