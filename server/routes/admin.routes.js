import express from 'express';
import { login, getMe, seedAdmin } from '../controllers/adminAuth.controllers.js';
import {
  adminGetBlogs, adminGetBlog, adminCreateBlog,
  adminUpdateBlog, adminTogglePublish, adminDeleteBlog,
} from '../controllers/adminBlog.controllers.js';
import {
  adminGetCourses, adminGetCourse, adminCreateCourse,
  adminUpdateCourse, adminToggleCoursePublish, adminDeleteCourse,
} from '../controllers/adminCourse.controllers.js';
import { getContacts, markContactRead } from '../controllers/contact.controllers.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);
router.post('/auth/seed', seedAdmin); // ⚠️ Remove after first admin created

// ── Blogs ─────────────────────────────────────────────────
router.route('/blogs')
  .get(protect, adminGetBlogs)
  .post(protect, adminCreateBlog);

router.route('/blogs/:id')
  .get(protect, adminGetBlog)
  .put(protect, adminUpdateBlog)
  .delete(protect, adminDeleteBlog);

router.patch('/blogs/:id/publish', protect, adminTogglePublish);

// ── Courses ───────────────────────────────────────────────
router.route('/courses')
  .get(protect, adminGetCourses)
  .post(protect, adminCreateCourse);

router.route('/courses/:id')
  .get(protect, adminGetCourse)
  .put(protect, adminUpdateCourse)
  .delete(protect, adminDeleteCourse);

router.patch('/courses/:id/publish', protect, adminToggleCoursePublish);

// ── Contacts ──────────────────────────────────────────────
router.get('/contacts', protect, getContacts);
router.patch('/contacts/:id/read', protect, markContactRead);

export default router;