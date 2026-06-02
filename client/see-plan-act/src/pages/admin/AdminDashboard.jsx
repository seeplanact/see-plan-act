import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCallback } from 'react';

import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { adminBlogsAPI, adminCoursesAPI } from '../../utils/adminApi.js';

import {
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlinePlusCircle,
  HiOutlinePencil,
} from 'react-icons/hi';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const StatCard = ({ label, value, color, loading }) => (
  <div className="bg-brand-card border border-brand-border p-5 sm:p-6 rounded-sm">
    <p className="text-white/30 font-mono text-xs uppercase tracking-wider mb-2">
      {label}
    </p>

    <p className={`font-display font-bold text-3xl sm:text-4xl ${color}`}>
      {loading ? '—' : value}
    </p>
  </div>
);

export default function AdminDashboard() {
  const { admin } = useAdminAuth();

  // FIXED: memoized fetch functions
  const fetchBlogs = useCallback(
    () => adminBlogsAPI.getAll({ limit: 5 }),
    []
  );

  const fetchCourses = useCallback(
    () => adminCoursesAPI.getAll({ limit: 5 }),
    []
  );

  const {
    data: blogData,
    loading: blogLoading,
  } = useFetch(fetchBlogs, []);

  const {
    data: courseData,
    loading: courseLoading,
  } = useFetch(fetchCourses, []);

  const bStats = blogData?.stats || {};
  const cStats = courseData?.stats || {};

  const recentBlogs = blogData?.data || [];
  const recentCourses = courseData?.data || [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-white/30 font-mono text-xs tracking-widest uppercase mb-1">
          Dashboard
        </p>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Welcome back, {admin?.name}
        </h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Blogs',
            value: bStats.total ?? 0,
            color: 'text-white',
            loading: blogLoading,
          },

          {
            label: 'Published Blogs',
            value: bStats.published ?? 0,
            color: 'text-brand-cyan',
            loading: blogLoading,
          },

          {
            label: 'Total Courses',
            value: cStats.total ?? 0,
            color: 'text-white',
            loading: courseLoading,
          },

          {
            label: 'Published Courses',
            value: cStats.published ?? 0,
            color: 'text-brand-cyan',
            loading: courseLoading,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        className="flex flex-wrap gap-3 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Link
          to="/admin/blogs/new"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <HiOutlinePlusCircle size={15} />
          New Blog
        </Link>

        <Link
          to="/admin/courses/new"
          className="btn-outline flex items-center gap-2 text-sm"
        >
          <HiOutlinePlusCircle size={15} />
          New Course
        </Link>
      </motion.div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <HiOutlineDocumentText
                size={16}
                className="text-brand-cyan"
              />
              Recent Blogs
            </h2>

            <Link
              to="/admin/blogs"
              className="text-white/30 font-mono text-xs hover:text-brand-cyan"
            >
              View all →
            </Link>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-sm overflow-hidden">
            {blogLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-brand-border border-t-brand-cyan rounded-full animate-spin" />
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-white/30 text-sm">
                  No blog posts yet
                </p>
              </div>
            ) : (
              recentBlogs.map((blog, i) => (
                <div
                  key={blog._id}
                  className={`flex items-center justify-between gap-4 px-4 py-3
                    hover:bg-white/2 transition-colors
                    ${
                      i < recentBlogs.length - 1
                        ? 'border-b border-brand-border'
                        : ''
                    }`}
                >
                  <div className="min-w-0">
                    <p className="text-white/80 text-sm truncate">
                      {blog.title}
                    </p>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`font-mono text-xs ${
                          blog.isPublished
                            ? 'text-brand-cyan'
                            : 'text-amber-400'
                        }`}
                      >
                        {blog.isPublished ? 'Live' : 'Draft'}
                      </span>

                      <span className="text-white/20 font-mono text-xs">
                        {formatDate(blog.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/admin/blogs/${blog._id}/edit`}
                    className="text-white/30 hover:text-brand-cyan"
                  >
                    <HiOutlinePencil size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <HiOutlineAcademicCap
                size={16}
                className="text-brand-cyan"
              />
              Recent Courses
            </h2>

            <Link
              to="/admin/courses"
              className="text-white/30 font-mono text-xs hover:text-brand-cyan"
            >
              View all →
            </Link>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-sm overflow-hidden">
            {courseLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-brand-border border-t-brand-cyan rounded-full animate-spin" />
              </div>
            ) : recentCourses.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-white/30 text-sm">
                  No courses yet
                </p>
              </div>
            ) : (
              recentCourses.map((course, i) => (
                <div
                  key={course._id}
                  className={`flex items-center justify-between gap-4 px-4 py-3
                    hover:bg-white/2 transition-colors
                    ${
                      i < recentCourses.length - 1
                        ? 'border-b border-brand-border'
                        : ''
                    }`}
                >
                  <div className="min-w-0">
                    <p className="text-white/80 text-sm truncate">
                      {course.title}
                    </p>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`font-mono text-xs ${
                          course.isPublished
                            ? 'text-brand-cyan'
                            : 'text-amber-400'
                        }`}
                      >
                        {course.isPublished ? 'Live' : 'Draft'}
                      </span>

                      <span className="text-white/20 font-mono text-xs">
                        {formatDate(course.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/admin/courses/${course._id}/edit`}
                    className="text-white/30 hover:text-brand-cyan"
                  >
                    <HiOutlinePencil size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}