import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import Loader from '../components/Loader.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { coursesAPI } from '../utils/api.js';
import { HiArrowLeft } from 'react-icons/hi';

const LEVEL_COLOR = {
  beginner:     'text-brand-cyan border-brand-cyan/30',
  intermediate: 'text-amber-400 border-amber-400/30',
  advanced:     'text-red-400 border-red-400/30',
};

const CATEGORY_LABEL = {
  see:         'See',
  plan:        'Plan',
  act:         'Act',
  'full-stack':'Full Stack',
};

export default function CourseDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(
    () => coursesAPI.getOne(slug),
    [slug]
  );
  const course = data?.data;

  if (loading) {
    return (
      <div className="pt-24">
        <Loader text="Loading course..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="pt-24 pb-20 container-custom text-center">
        <p className="text-white/40 font-body mb-6">{error || 'Course not found.'}</p>
        <Link to="/courses" className="btn-outline">← Back to Courses</Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={course.title}
        description={course.description}
      />

      <div className="pt-24 pb-20">
        <div className="container-custom max-w-4xl mx-auto">

          {/* Back */}
          <Link
            to="/courses"
            className="inline-flex items-center gap-1 text-white/30 font-mono text-xs hover:text-brand-cyan transition-colors mb-8"
          >
            <HiArrowLeft size={12} /> Back to Courses
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-brand-cyan font-display font-bold text-lg">
                {CATEGORY_LABEL[course.category] || course.category}
              </span>
              <span className={`text-xs font-mono border px-2 py-0.5 rounded-sm capitalize ${LEVEL_COLOR[course.level] || 'text-white/40 border-white/10'}`}>
                {course.level}
              </span>
              {course.isFeatured && (
                <span className="text-xs font-mono border border-brand-cyan/30 text-brand-cyan px-2 py-0.5 rounded-sm">
                  Featured
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              {course.title}
            </h1>

            <p className="text-white/60 font-body text-base sm:text-lg leading-relaxed mb-10">
              {course.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-brand-border mb-10">
              {course.duration && (
                <div>
                  <p className="text-white/25 font-mono text-xs uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-white font-body text-sm">{course.duration}</p>
                </div>
              )}
              <div>
                <p className="text-white/25 font-mono text-xs uppercase tracking-wider mb-1">Level</p>
                <p className="text-white font-body text-sm capitalize">{course.level}</p>
              </div>
              <div>
                <p className="text-white/25 font-mono text-xs uppercase tracking-wider mb-1">Category</p>
                <p className="text-white font-body text-sm">
                  {CATEGORY_LABEL[course.category] || course.category}
                </p>
              </div>
            </div>

            {/* Topics */}
            {course.topics?.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display font-semibold text-white text-xl mb-4">
                  What you'll learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.topics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-3 px-4 py-3 border border-brand-border rounded-sm bg-brand-card"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0" />
                      <span className="text-white/70 font-body text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="p-6 border border-brand-border rounded-sm bg-brand-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-display font-semibold mb-1">Ready to start?</p>
                <p className="text-white/40 font-body text-sm">Enroll now and begin your robotics journey.</p>
              </div>
              <button className="btn-primary whitespace-nowrap">Enroll Now</button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}