const router = require('express').Router();
const controller = require('./subscriptions.controller');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');

router.use(authenticate);

router.get('/plans', controller.getPlans);
router.get('/', controller.getSubscription);
router.get('/all', requireRole('SUPER_ADMIN'), controller.getAllSubscriptions);
router.post('/upgrade', requireRole('SCHOOL_ADMIN'), controller.upgradePlan);
router.post('/cancel', requireRole('SCHOOL_ADMIN'), controller.cancelSubscription);
router.get('/:schoolId', requireRole('SUPER_ADMIN'), controller.getSubscription);

module.exports = router;
