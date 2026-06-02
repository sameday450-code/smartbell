const router = require('express').Router();
const controller = require('./announcements.controller');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');

router.use(authenticate);

router.get('/', controller.getAnnouncements);
router.post('/emergency', requireRole('SCHOOL_ADMIN'), controller.triggerEmergency);
router.post('/manual', requireRole('STAFF'), controller.triggerManual);

module.exports = router;
