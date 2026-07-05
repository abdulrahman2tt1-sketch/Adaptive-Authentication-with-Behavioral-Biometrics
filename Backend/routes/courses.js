const express = require('express');
const router = express.Router();
const courseCtrl = require('../controllers/courseController');

router.get('/', courseCtrl.getCourses);
router.get('/:slug', courseCtrl.getCourse);
router.post('/', courseCtrl.createCourse);
router.put('/:id', courseCtrl.updateCourse);
router.delete('/:id', courseCtrl.deleteCourse);

module.exports = router;
