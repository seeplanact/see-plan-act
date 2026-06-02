import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminCoursesAPI } from '../../utils/adminApi.js';
import { HiArrowLeft } from 'react-icons/hi';

const CATEGORIES = ['see', 'plan', 'act', 'full-stack'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

const EMPTY = {
  title: '',
  description: '',
  category: 'see',
  level: 'beginner',
  duration: '',
  topics: '',
  isPublished: false,
  isFeatured: false,
  order: 0,
};

export default function AdminCourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await adminCoursesAPI.getOne(id);
        const c = data.data;
        setForm({
          title: c.title || '',
          description: c.description || '',
          category: c.category || 'see',
          level: c.level || 'beginner',
          duration: c.duration || '',
          topics: c.topics?.join(', ') || '',
          isPublished: c.isPublished || false,
          isFeatured: c.isFeatured || false,
          order: c.order || 0,
        });
      } catch {
        toast.error('Failed to load course');
        navigate('/admin/courses');
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e, publish = null) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      level: form.level,
      duration: form.duration.trim(),
      topics: form.topics.split(',').map((t) => t.trim()).filter(Boolean),
      isPublished: publish !== null ? publish : form.isPublished,
      isFeatured: form.isFeatured,
      order: Number(form.order),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await adminCoursesAPI.update(id, payload);
        toast.success('Course updated');
      } else {
        await adminCoursesAPI.create(payload);
        toast.success(payload.isPublished ? 'Course published!' : 'Course saved as draft');
      }
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-border border-t-brand-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-1 text-white/30 font-mono text-xs hover:text-brand-cyan transition-colors mb-4"
        >
          <HiArrowLeft size={12} /> Back to courses
        </Link>
        <p className="text-white/30 font-mono text-xs tracking-widest uppercase mb-1">
          {isEdit ? 'Edit' : 'New'}
        </p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          {isEdit ? 'Edit Course' : 'Create Course'}
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-white/40 tracking-wider uppercase">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Course title..."
            className="input-field"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-white/40 tracking-wider uppercase">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="What will students learn in this course?"
            rows={4}
            className="input-field resize-none"
          />
        </div>

        {/* Category + Level row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="input-field text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Level</label>
            <select
              value={form.level}
              onChange={(e) => set('level', e.target.value)}
              className="input-field text-sm"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration + Order row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Duration</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => set('duration', e.target.value)}
              placeholder="e.g. 8 weeks"
              className="input-field text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Display Order</label>
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={(e) => set('order', e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Topics</label>
          <input
            type="text"
            value={form.topics}
            onChange={(e) => set('topics', e.target.value)}
            placeholder="OpenCV, ROS 2, Path Planning  (comma separated)"
            className="input-field text-sm"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set('isFeatured', e.target.checked)}
              className="w-4 h-4 accent-brand-cyan"
            />
            <span className="font-body text-white/60 text-sm">Featured course</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-brand-border">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="btn-outline flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? <span className="w-4 h-4 border-2 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin" /> : null}
            Save as Draft
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : null}
            {isEdit ? 'Update & Publish' : 'Publish Now'}
          </button>

          <Link to="/admin/courses" className="px-4 py-2 text-white/30 font-body text-sm hover:text-white transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}