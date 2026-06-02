import Blog from '../models/blog.models.js';

// @desc    Get ALL blogs for admin (includes drafts, search, filter)
// @route   GET /api/admin/blogs
export const adminGetBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;
    const { search, status, category } = req.query;

    const filter = {};
    if (status === 'published') filter.isPublished = true;
    if (status === 'draft') filter.isPublished = false;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const [blogs, total, published, drafts] = await Promise.all([
      Blog.find(filter).select('-content').sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter),
      Blog.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: false }),
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      stats: { published, drafts, total: published + drafts },
      data: blogs,
    });
  } catch (error) { next(error); }
};

// @desc    Get single blog by ID for editing
// @route   GET /api/admin/blogs/:id
export const adminGetBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

// @desc    Create blog
// @route   POST /api/admin/blogs
export const adminCreateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: { name: req.body.authorName || req.admin.name },
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

// @desc    Update blog
// @route   PUT /api/admin/blogs/:id
export const adminUpdateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, author: { name: req.body.authorName || req.admin.name } },
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

// @desc    Toggle publish
// @route   PATCH /api/admin/blogs/:id/publish
export const adminTogglePublish = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.isPublished = !blog.isPublished;
    if (blog.isPublished && !blog.publishedAt) blog.publishedAt = new Date();
    await blog.save();
    res.status(200).json({
      success: true,
      message: blog.isPublished ? 'Blog published' : 'Blog moved to drafts',
      data: { isPublished: blog.isPublished },
    });
  } catch (error) { next(error); }
};

// @desc    Delete blog
// @route   DELETE /api/admin/blogs/:id
export const adminDeleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, message: 'Blog deleted' });
  } catch (error) { next(error); }
};