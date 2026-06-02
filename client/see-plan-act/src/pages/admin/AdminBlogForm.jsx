import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminBlogsAPI } from '../../utils/adminApi.js';
import { HiOutlinePlus, HiOutlineTrash, HiArrowLeft } from 'react-icons/hi';

const CATEGORIES = ['computer-vision', 'path-planning', 'robotics', 'ai', 'tutorial', 'general'];

const EMPTY = {
  title: '',
  excerpt: '',
  content: '',
  category: 'general',
  tags: '',
  readTime: 5,
  isPublished: false,
  imageUrls: [''],       // array of image URL strings
  youtubeLinks: [{ url: '', title: '' }],
};

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load existing blog when editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await adminBlogsAPI.getOne(id);
        const b = data.data;
        setForm({
          title: b.title || '',
          excerpt: b.excerpt || '',
          content: b.content || '',
          category: b.category || 'general',
          tags: b.tags?.join(', ') || '',
          readTime: b.readTime || 5,
          isPublished: b.isPublished || false,
          imageUrls: b.images?.map((img) => img.url) || [''],
          youtubeLinks: b.youtubeLinks?.length
            ? b.youtubeLinks
            : [{ url: '', title: '' }],
        });
      } catch {
        toast.error('Failed to load blog');
        navigate('/admin/blogs');
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // ── Image URL handlers ──────────────────────────────────
  const addImageUrl = () => set('imageUrls', [...form.imageUrls, '']);
  const removeImageUrl = (i) => set('imageUrls', form.imageUrls.filter((_, idx) => idx !== i));
  const updateImageUrl = (i, val) => {
    const arr = [...form.imageUrls];
    arr[i] = val;
    set('imageUrls', arr);
  };

  // ── YouTube handlers ────────────────────────────────────
  const addYoutube = () => set('youtubeLinks', [...form.youtubeLinks, { url: '', title: '' }]);
  const removeYoutube = (i) => set('youtubeLinks', form.youtubeLinks.filter((_, idx) => idx !== i));
  const updateYoutube = (i, key, val) => {
    const arr = [...form.youtubeLinks];
    arr[i] = { ...arr[i], [key]: val };
    set('youtubeLinks', arr);
  };

  // ── Extract YouTube embed ID ────────────────────────────
  const getYoutubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const handleSubmit = async (e, publish = null) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.excerpt.trim()) { toast.error('Description is required'); return; }

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      readTime: Number(form.readTime),
      isPublished: publish !== null ? publish : form.isPublished,
      images: form.imageUrls
        .filter((u) => u.trim())
        .map((url) => ({ url: url.trim(), caption: '' })),
      youtubeLinks: form.youtubeLinks.filter((y) => y.url.trim()),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await adminBlogsAPI.update(id, payload);
        toast.success('Blog updated');
      } else {
        await adminBlogsAPI.create(payload);
        toast.success(payload.isPublished ? 'Blog published!' : 'Blog saved as draft');
      }
      navigate('/admin/blogs');
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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-1 text-white/30 font-mono text-xs hover:text-brand-cyan transition-colors mb-4"
        >
          <HiArrowLeft size={12} /> Back to blogs
        </Link>
        <p className="text-white/30 font-mono text-xs tracking-widest uppercase mb-1">
          {isEdit ? 'Edit' : 'New'}
        </p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          {isEdit ? 'Edit Blog Post' : 'Create Blog Post'}
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ── Title (required) ── */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-white/40 tracking-wider uppercase">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Enter blog title..."
            className="input-field text-base"
          />
        </div>

        {/* ── Description (required) ── */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-white/40 tracking-wider uppercase">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            placeholder="Short description shown on blog cards..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* ── Content (optional) ── */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-white/40 tracking-wider uppercase">
            Full Content <span className="text-white/20">(optional)</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            placeholder="Full blog content — supports HTML..."
            rows={10}
            className="input-field resize-y font-mono text-sm"
          />
        </div>

        {/* ── Image URLs (optional) ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">
              Images <span className="text-white/20">(optional)</span>
            </label>
            <button
              type="button"
              onClick={addImageUrl}
              className="flex items-center gap-1 text-brand-cyan font-mono text-xs hover:text-brand-green transition-colors"
            >
              <HiOutlinePlus size={12} /> Add image
            </button>
          </div>

          {form.imageUrls.map((url, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(i, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field flex-1 text-sm"
                />
                {form.imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="p-2 text-white/30 hover:text-red-400 transition-colors border border-brand-border rounded-sm"
                  >
                    <HiOutlineTrash size={15} />
                  </button>
                )}
              </div>
              {/* Preview */}
              {url.trim() && (
                <div className="rounded-sm overflow-hidden border border-brand-border">
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── YouTube Links (optional) ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">
              YouTube Videos <span className="text-white/20">(optional)</span>
            </label>
            <button
              type="button"
              onClick={addYoutube}
              className="flex items-center gap-1 text-brand-cyan font-mono text-xs hover:text-brand-green transition-colors"
            >
              <HiOutlinePlus size={12} /> Add video
            </button>
          </div>

          {form.youtubeLinks.map((yt, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 border border-brand-border rounded-sm bg-black/30">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={yt.url}
                  onChange={(e) => updateYoutube(i, 'url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="input-field flex-1 text-sm"
                />
                {form.youtubeLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeYoutube(i)}
                    className="p-2 text-white/30 hover:text-red-400 transition-colors border border-brand-border rounded-sm"
                  >
                    <HiOutlineTrash size={15} />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={yt.title}
                onChange={(e) => updateYoutube(i, 'title', e.target.value)}
                placeholder="Video title (optional)"
                className="input-field text-sm"
              />
              {/* YouTube preview */}
              {yt.url && getYoutubeId(yt.url) && (
                <div className="aspect-video rounded-sm overflow-hidden border border-brand-border">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(yt.url)}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={yt.title || `Video ${i + 1}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Meta row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="input-field text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Read Time (min)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={form.readTime}
              onChange={(e) => set('readTime', e.target.value)}
              className="input-field text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="robotics, ai, vision"
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* ── Action buttons ── */}
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

          <Link to="/admin/blogs" className="px-4 py-2 text-white/30 font-body text-sm hover:text-white transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}