const router = require('express').Router();
const controller = require('./audio-files.controller');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { uploadAudio } = require('../../middlewares/upload');

router.use(authenticate);

router.get('/', controller.getAudioFiles);
router.post('/', requireRole('STAFF'), uploadAudio.single('audio'), controller.uploadAudioFile);
router.delete('/:id', requireRole('STAFF'), controller.deleteAudioFile);

module.exports = router;
