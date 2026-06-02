import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

const FEATURES = [
  {
    title: 'See',
    description: 'Perceiving the real world through advanced computer vision.',
    delay: 0,
  },
  {
    title: 'Plan',
    description: 'Calculating the most efficient path with intelligent algorithms.',
    delay: 0.1,
  },
  {
    title: 'Act',
    description: 'Executing precision movements with robust robotic hardware.',
    delay: 0.2,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

const Home = () => (
  <>
    <SEO />

    {/* Hero Section */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Radial green glow background */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 bg-radial-green pointer-events-none" />

      <div className="relative z-10 text-center px-4 sm:px-6">
        <motion.h1
          className="font-display font-bold leading-none tracking-tight mb-6"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 9rem)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="text-white">SEE</span>
          <span className="text-brand-cyan">PLAN</span>
          <span className="text-white">ACT</span>
        </motion.h1>

        <motion.p
          className="text-white/60 font-body text-base sm:text-lg md:text-xl tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Robots that see, plan, and act.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/courses" className="btn-primary">
            Explore Courses
          </Link>
          <Link to="/about" className="btn-outline">
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Feature Cards Section */}
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-border">
          {FEATURES.map(({ title, description, delay }) => (
            <motion.div
              key={title}
              className="bg-black p-8 sm:p-10 lg:p-12 card-glow group cursor-default"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={delay}
            >
              <h3 className="font-display font-bold text-brand-cyan text-xl sm:text-2xl mb-4 sm:mb-6">
                {title}
              </h3>
              <p className="font-body text-white/80 text-base sm:text-lg leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Home;
