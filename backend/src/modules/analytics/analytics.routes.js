const router = require('express').Router();
const controller = require('./analytics.controller');
const { authenticate } = require('../../middlewares/auth');

router.use(authenticate);

router.get('/dashboard', controller.getDashboard);
router.get('/usage', controller.getUsageChart);

module.exports = router;
