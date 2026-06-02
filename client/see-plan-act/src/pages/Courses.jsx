import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import Loader from '../components/Loader.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { coursesAPI } from '../utils/api.js';
import { HiOutlineSearch } from 'react-icons/hi';

const CATEGORY_LABEL = {
  see:          'See',
  plan:         'Plan',
  act:          'Act',
  'full-stack': 'Full Stack',
};

const LEVEL_COLOR = {
  beginner:     'text-brand-cyan border-brand-cyan/30',
  intermediate: 'text-amber-400 border-amber-400/30',
  advanced:     'text-red-400 border-red-400/30',
};

const PLACEHOLDER_COURSES = [
  {
    _id: '1', slug: 'computer-vision-fundamentals',
    title: 'Computer Vision Fundamentals',
    description: 'Learn how robots perceive the world using cameras, depth sensors, and advanced CV algorithms.',
    category: 'see', level: 'beginner', duration: '8 weeks',
    topics: ['OpenCV', 'Object Detection', 'Depth Estimation'],
  },
  {
    _id: '2', slug: 'path-planning-algorithms',
    title: 'Path Planning Algorithms',
    description: 'Master A*, RRT, Dijkstra and modern learned planners for autonomous navigation.',
    category: 'plan', level: 'intermediate', duration: '6 weeks',
    topics: ['A* Search', 'RRT', 'Motion Planning'],
  },
  {
    _id: '3', slug: 'robotic-actuation-systems',
    title: 'Robotic Actuation Systems',
    description: 'From servo motors to hydraulic actuators — build systems that move with precision.',
    category: 'act', level: 'advanced', duration: '10 weeks',
    topics: ['Servo Control', 'Kinematics', 'ROS 2'],
  },
];

const Courses = () => {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel]       = useState('');

  const { data, loading, error } = useFetch(() => coursesAPI.getAll(), []);
  const allCourses = data?.data?.length ? data.data : PLACEHOLDER_COURSES;

  // Client-side filtering
  const courses = allCourses.filter((c) => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || c.category === category;
    const matchLevel    = !level    || c.level === level;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <>
      <SEO
        title="Courses"
        description="Structured robotics courses covering computer vision, path planning, and robotic actuation."
      />

      <div className="pt-24 pb-20">
        <div className="container-custom">

          {/* Header */}
          <motion.div
            className="mb-10 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-brand-cyan font-mono text-sm tracking-widest uppercase block mb-4">
              Courses
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight">
              Learn the full stack of robotics
            </h1>
          </motion.div>

          {/* Search + filters */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="relative flex-1">
              <HiOutlineSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                size={15}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 text-sm"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field text-sm w-full sm:w-36"
            >
              <option value="">All Topics</option>
              <option value="see">See</option>
              <option value="plan">Plan</option>
              <option value="act">Act</option>
              <option value="full-stack">Full Stack</option>
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="input-field text-sm w-full sm:w-36"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </motion.div>

          {/* Results */}
          {loading ? (
            <Loader text="Fetching courses..." />
          ) : error ? (
            <p className="text-red-400 text-sm font-body text-center py-12">{error}</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/30 font-body text-sm mb-4">No courses match your search.</p>
              <button
                onClick={() => { setSearch(''); setCategory(''); setLevel(''); }}
                className="btn-outline text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  className="card card-glow flex flex-col gap-4 group"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-brand-cyan font-display font-bold text-lg">
                      {CATEGORY_LABEL[course.category] || course.category}
                    </span>
                    <span className={`text-xs font-mono border px-2 py-0.5 rounded-sm capitalize ${LEVEL_COLOR[course.level] || 'text-white/40 border-white/10'}`}>
                      {course.level}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-white text-lg leading-snug group-hover:text-brand-cyan transition-colors duration-200">
                    {course.title}
                  </h3>

                  <p className="font-body text-white/50 text-sm leading-relaxed flex-1">
                    {course.description}
                  </p>

                  {course.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.topics.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-xs font-mono text-white/30 border border-brand-border px-2 py-0.5 rounded-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-border">
                    {course.duration && (
                      <p className="text-white/30 font-mono text-xs">{course.duration}</p>
                    )}
                    <Link
                      to={`/courses/${course.slug}`}
                      className="text-brand-cyan font-mono text-xs hover:text-brand-green transition-colors ml-auto"
                    >
                      View course →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;