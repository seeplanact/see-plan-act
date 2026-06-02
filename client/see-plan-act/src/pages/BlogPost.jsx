import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import Loader from '../components/Loader.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { blogsAPI } from '../utils/api.js';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const BlogPost = () => {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(() => blogsAPI.getOne(slug), [slug]);
  const blog = data?.data;

  if (loading) return <div className="pt-24"><Loader text="Loading article..." /></div>;

  if (error || !blog) {
    return (
      <div className="pt-24 pb-20 container-custom text-center">
        <p className="text-white/40 font-body mb-6">{error || 'Article not found.'}</p>
        <Link to="/blogs" className="btn-outline">← Back to Blogs</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={blog.title} description={blog.excerpt} />

      <div className="pt-24 pb-20">
        <div className="container-custom max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/blogs"
              className="text-white/30 font-mono text-xs hover:text-brand-cyan transition-colors inline-block mb-8"
            >
              ← Back to Blogs
            </Link>

            <span className="text-brand-cyan font-mono text-xs uppercase tracking-widest block mb-4">
              {blog.category?.replace('-', ' ')}
            </span>

            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/30 font-mono text-xs mb-10 pb-10 border-b border-brand-border">
              <span>{blog.author?.name}</span>
              {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
              <span>{blog.readTime} min read</span>
              <span>{blog.views} views</span>
            </div>

            <div
              className="prose prose-invert prose-sm sm:prose-base max-w-none
                         prose-headings:font-display prose-headings:font-semibold
                         prose-p:text-white/70 prose-p:leading-relaxed
                         prose-a:text-brand-cyan prose-a:no-underline hover:prose-a:text-brand-green
                         prose-code:text-brand-cyan prose-code:bg-brand-border prose-code:px-1 prose-code:rounded
                         prose-pre:bg-brand-card prose-pre:border prose-pre:border-brand-border"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-brand-border">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-white/30 border border-brand-border px-3 py-1 rounded-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
