import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    author: {
      name: { type: String, default: 'SeePlanAct Team' },
      avatar: { type: String, default: '' },
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    category: {
      type: String,
      enum: ['computer-vision', 'path-planning', 'robotics', 'ai', 'tutorial', 'general'],
      default: 'general',
    },
    // Multiple images support
    images: [
      {
        url:       { type: String, required: true },
        caption:   { type: String, default: '' },
        public_id: { type: String, default: '' },
      },
    ],
    // YouTube video links
    youtubeLinks: [
      {
        url:   { type: String, required: true },
        title: { type: String, default: '' },
      },
    ],
    thumbnail: {
      type: String,
      default: '',
    },
    readTime:    { type: Number, default: 5 },
    views:       { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  // Auto-set thumbnail from first image if not set
  if (this.isModified('images') && this.images?.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0].url;
  }
  next();
});

blogSchema.index({ slug: 1, isPublished: 1, tags: 1 });

export default mongoose.model('Blog', blogSchema);