import express from 'express';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/course.controllers.js';

const router = express.Router();

router.route('/').get(getCourses).post(createCourse);
router.route('/:slug').get(getCourse);
router.route('/id/:id').put(updateCourse).delete(deleteCourse);

export default router;