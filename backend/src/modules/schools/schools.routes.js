const router = require('express').Router();
const controller = require('./schools.controller');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { uploadImage } = require('../../middlewares/upload');

router.use(authenticate);

router.get('/', requireRole('SUPER_ADMIN'), controller.getAllSchools);
router.post('/', requireRole('SUPER_ADMIN'), uploadImage.single('logo'), controller.createSchool);
router.get('/:id', requireRole('SCHOOL_ADMIN'), controller.getSchool);
router.put('/:id', requireRole('SCHOOL_ADMIN'), uploadImage.single('logo'), controller.updateSchool);
router.patch('/:id/status', requireRole('SUPER_ADMIN'), controller.updateSchoolStatus);
router.delete('/:id', requireRole('SUPER_ADMIN'), controller.deleteSchool);

module.exports = router;
