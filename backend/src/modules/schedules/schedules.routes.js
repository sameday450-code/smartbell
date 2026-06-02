const router = require('express').Router();
const controller = require('./schedules.controller');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { uploadAudio } = require('../../middlewares/upload');

router.use(authenticate);

router.get('/', controller.getSchedules);
router.post('/', requireRole('STAFF'), uploadAudio.single('audio'), controller.createSchedule);
router.get('/:id', controller.getSchedule);
router.put('/:id', requireRole('STAFF'), uploadAudio.single('audio'), controller.updateSchedule);
router.delete('/:id', requireRole('STAFF'), controller.deleteSchedule);
router.patch('/:id/toggle', requireRole('STAFF'), controller.toggleSchedule);

module.exports = router;
