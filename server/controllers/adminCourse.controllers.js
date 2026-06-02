import Course from '../models/course.models.js';

// @desc    Get ALL courses for admin
// @route   GET /api/admin/courses
export const adminGetCourses = async (req, res, next) => {
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
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [courses, total, published, drafts] = await Promise.all([
      Course.find(filter).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit),
      Course.countDocuments(filter),
      Course.countDocuments({ isPublished: true }),
      Course.countDocuments({ isPublished: false }),
    ]);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      stats: { published, drafts, total: published + drafts },
      data: courses,
    });
  } catch (error) { next(error); }
};

// @desc    Get single course by ID
// @route   GET /api/admin/courses/:id
export const adminGetCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, data: course });
  } catch (error) { next(error); }
};

// @desc    Create course
// @route   POST /api/admin/courses
export const adminCreateCourse = async (req, res, next) => {
  try {
    // Parse topics from comma-separated string if needed
    const topics = typeof req.body.topics === 'string'
      ? req.body.topics.split(',').map((t) => t.trim()).filter(Boolean)
      : req.body.topics || [];

    const course = await Course.create({ ...req.body, topics });
    res.status(201).json({ success: true, data: course });
  } catch (error) { next(error); }
};

// @desc    Update course
// @route   PUT /api/admin/courses/:id
export const adminUpdateCourse = async (req, res, next) => {
  try {
    const topics = typeof req.body.topics === 'string'
      ? req.body.topics.split(',').map((t) => t.trim()).filter(Boolean)
      : req.body.topics;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(topics && { topics }) },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, data: course });
  } catch (error) { next(error); }
};

// @desc    Toggle publish
// @route   PATCH /api/admin/courses/:id/publish
export const adminToggleCoursePublish = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.isPublished = !course.isPublished;
    await course.save();
    res.status(200).json({
      success: true,
      message: course.isPublished ? 'Course published' : 'Course unpublished',
      data: { isPublished: course.isPublished },
    });
  } catch (error) { next(error); }
};

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
export const adminDeleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) { next(error); }
};