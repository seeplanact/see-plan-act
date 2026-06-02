import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useFetch } from '../../hooks/useFetch.js';
import { adminCoursesAPI } from '../../utils/adminApi.js';
import {
  HiOutlinePencil, HiOutlineTrash, HiOutlinePlusCircle, HiOutlineSearch,
} from 'react-icons/hi';

const LEVEL_COLOR = {
  beginner: 'text-brand-cyan border-brand-cyan/30',
  intermediate: 'text-amber-400 border-amber-400/30',
  advanced: 'text-red-400 border-red-400/30',
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function AdminCourseList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCourses = useCallback(
    () => adminCoursesAPI.getAll({ page, limit: 15, search, status }),
    [page, search, status]
  );

  const { data, loading, refetch } = useFetch(fetchCourses, [page, search, status]);
  const courses = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const stats = data?.stats || {};

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await adminCoursesAPI.delete(id);
      toast.success('Course deleted');
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id, current) => {
    setTogglingId(id);
    try {
      await adminCoursesAPI.togglePublish(id);
      toast.success(current ? 'Course unpublished' : 'Course published');
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-white/30 font-mono text-xs tracking-widest uppercase mb-1">Courses</p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">All Courses</h1>
          <div className="flex gap-4 mt-1">
            <span className="text-white/30 font-mono text-xs">{stats.total ?? 0} total</span>
            <span className="text-brand-cyan font-mono text-xs">{stats.published ?? 0} published</span>
            <span className="text-amber-400 font-mono text-xs">{stats.drafts ?? 0} drafts</span>
          </div>
        </div>
        <Link to="/admin/courses/new" className="btn-primary flex items-center gap-2 text-sm self-start">
          <HiOutlinePlusCircle size={16} /> New Course
        </Link>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="input-field text-sm w-full sm:w-36"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand-border border-t-brand-cyan rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-sm p-12 text-center">
          <p className="text-white/30 font-body text-sm mb-4">
            {search || status ? 'No courses match your filters.' : 'No courses yet.'}
          </p>
          {!search && !status && (
            <Link to="/admin/courses/new" className="btn-primary text-sm">Create your first course</Link>
          )}
        </div>
      ) : (
        <>
          <div className="bg-brand-card border border-brand-border rounded-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_90px_100px_90px_90px] gap-4 px-6 py-3 border-b border-brand-border">
              {['Title', 'Category', 'Level', 'Status', 'Actions'].map((h) => (
                <span key={h} className="font-mono text-xs text-white/25 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                className={`sm:grid sm:grid-cols-[1fr_90px_100px_90px_90px] gap-4 px-4 sm:px-6 py-4
                  hover:bg-white/2 transition-colors
                  ${i < courses.length - 1 ? 'border-b border-brand-border' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="min-w-0 mb-2 sm:mb-0">
                  <p className="text-white/90 font-body text-sm truncate">{course.title}</p>
                  <p className="text-white/25 font-mono text-xs mt-0.5">{formatDate(course.updatedAt)}</p>
                </div>

                <div className="flex items-center mb-1 sm:mb-0">
                  <span className="text-white/40 font-mono text-xs capitalize">{course.category}</span>
                </div>

                <div className="flex items-center mb-1 sm:mb-0">
                  <span className={`font-mono text-xs border px-2 py-0.5 rounded-sm capitalize ${LEVEL_COLOR[course.level] || 'text-white/40 border-white/10'}`}>
                    {course.level}
                  </span>
                </div>

                <div className="flex items-center mb-2 sm:mb-0">
                  <button
                    onClick={() => handleToggle(course._id, course.isPublished)}
                    disabled={togglingId === course._id}
                    className={`font-mono text-xs px-2 py-1 border rounded-sm transition-all disabled:opacity-50
                      ${course.isPublished
                        ? 'text-brand-cyan border-brand-cyan/30 hover:bg-brand-cyan/10'
                        : 'text-amber-400 border-amber-400/30 hover:bg-amber-400/10'
                      }`}
                  >
                    {togglingId === course._id ? '...' : course.isPublished ? 'Live' : 'Draft'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/courses/${course._id}/edit`}
                    className="p-1.5 text-white/30 hover:text-brand-cyan transition-colors"
                    title="Edit"
                  >
                    <HiOutlinePencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id, course.title)}
                    disabled={deletingId === course._id}
                    className="p-1.5 text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    {deletingId === course._id
                      ? <span className="w-3.5 h-3.5 border border-white/20 border-t-white/60 rounded-full animate-spin inline-block" />
                      : <HiOutlineTrash size={15} />
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-brand-border text-white/40 text-sm font-mono hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-sm"
              >
                ← Prev
              </button>
              <span className="text-white/30 font-mono text-sm">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-brand-border text-white/40 text-sm font-mono hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-sm"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}