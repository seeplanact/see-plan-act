import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const About = () => (
  <>
    <SEO title="About" description="Learn about SeePlanAct — where robotics meets intelligence." />

    <div className="pt-24 pb-20 container-custom">
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        <motion.span
          variants={fadeUp}
          className="text-brand-cyan font-mono text-sm tracking-widest uppercase block mb-4"
        >
          About
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-8"
        >
          Building the future of{' '}
          <span className="text-brand-cyan">intelligent robotics</span>
        </motion.h1>

        <motion.div variants={fadeUp} className="space-y-5 text-white/70 font-body text-base sm:text-lg leading-relaxed">
          <p>
            SeePlanAct is an educational platform dedicated to the intersection of computer
            vision, path planning, and robotic actuation. We believe that the next generation
            of robots must deeply perceive their environment, reason intelligently about
            navigation, and execute with precision.
          </p>
          <p>
            Our courses are designed for engineers, researchers, and enthusiasts who want to
            understand not just the theory, but the hands-on implementation of autonomous
            robotic systems.
          </p>
          <p>
            Whether you&apos;re a student exploring robotics for the first time or a seasoned
            engineer advancing your skills, SeePlanAct offers structured learning paths that
            take you from fundamentals to production-grade robotic systems.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 pt-14 border-t border-brand-border"
        >
          {[
            { stat: '3+', label: 'Core disciplines' },
            { stat: '100%', label: 'Practical focus' },
            { stat: '∞', label: 'Curiosity required' },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-4xl text-brand-cyan mb-2">{stat}</div>
              <div className="font-body text-white/40 text-sm tracking-wide">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </>
);

export default About;
