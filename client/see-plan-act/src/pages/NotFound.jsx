import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';

const NotFound = () => (
  <>
    <SEO title="404 — Not Found" />

    <div className="min-h-screen flex items-center justify-center text-center px-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-brand-cyan text-sm tracking-widest mb-4">404</p>
        <h1 className="font-display font-bold text-5xl sm:text-6xl mb-6">
          Page not found
        </h1>
        <p className="text-white/40 font-body text-base mb-10 max-w-sm mx-auto">
          The route you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Go home
        </Link>
      </motion.div>
    </div>
  </>
);

export default NotFound;
