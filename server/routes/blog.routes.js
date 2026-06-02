import express from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controllers.js';

const router = express.Router();

router.route('/').get(getBlogs).post(createBlog);
router.route('/:slug').get(getBlog);
router.route('/id/:id').put(updateBlog).delete(deleteBlog);

export default router;