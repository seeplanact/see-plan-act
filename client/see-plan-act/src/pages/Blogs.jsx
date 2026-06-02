import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import Loader from '../components/Loader.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { blogsAPI } from '../utils/api.js';

const PLACEHOLDER_BLOGS = [
  {
    _id: '1',
    slug: 'intro-to-computer-vision',
    title: 'An Introduction to Computer Vision for Robotics',
    excerpt: 'How modern robots perceive the world using cameras, depth sensors, and convolutional neural networks.',
    category: 'computer-vision',
    author: { name: 'SeePlanAct Team' },
    readTime: 6,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    slug: 'rrt-path-planning',
    title: 'RRT and Its Variants Explained',
    excerpt: 'A deep dive into Rapidly-exploring Random Trees — the gold standard for motion planning in high-dimensional spaces.',
    category: 'path-planning',
    author: { name: 'SeePlanAct Team' },
    readTime: 8,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    slug: 'ros2-getting-started',
    title: 'Getting Started with ROS 2 for Robot Control',
    excerpt: 'Everything you need to know to build your first ROS 2 node and communicate between robotic subsystems.',
    category: 'robotics',
    author: { name: 'SeePlanAct Team' },
    readTime: 10,
    publishedAt: new Date().toISOString(),
  },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const Blogs = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch(() => blogsAPI.getAll({ page, limit: 9 }), [page]);

  const blogs = data?.data?.length ? data.data : PLACEHOLDER_BLOGS;
  const totalPages = data?.totalPages || 1;

  return (
    <>
      <SEO title="Blogs" description="Articles on robotics, computer vision, path planning, and AI." />

      <div className="pt-24 pb-20">
        <div className="container-custom">
          <motion.div
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-brand-cyan font-mono text-sm tracking-widest uppercase block mb-4">
              Blogs
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight">
              Ideas, tutorials &amp; research
            </h1>
          </motion.div>

          {loading ? (
            <Loader text="Loading articles..." />
          ) : error ? (
            <p className="text-red-400 text-sm text-center py-12">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, i) => (
                  <motion.article
                    key={blog._id}
                    className="card card-glow flex flex-col gap-3 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                  >
                    <span className="text-brand-cyan font-mono text-xs uppercase tracking-wider">
                      {blog.category?.replace('-', ' ')}
                    </span>

                    <h2 className="font-display font-semibold text-white text-base sm:text-lg leading-snug group-hover:text-brand-cyan transition-colors duration-200">
                      <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h2>

                    <p className="font-body text-white/50 text-sm leading-relaxed flex-1">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-brand-border">
                      <span className="text-white/30 font-mono text-xs">{blog.author?.name}</span>
                      <div className="flex items-center gap-3 text-white/30 font-mono text-xs">
                        {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                        <span>{blog.readTime} min read</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-brand-border text-white/40 text-sm font-mono hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  <span className="text-white/30 font-mono text-sm">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-brand-border text-white/40 text-sm font-mono hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;
