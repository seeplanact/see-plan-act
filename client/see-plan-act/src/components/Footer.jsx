import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border mt-auto">
      <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <p className="text-white/40 font-body text-sm">
          © {year} SeePlanAct.
        </p>

        <div className="flex items-center gap-2 text-white/40 font-body text-sm">
          <span>Get Social —</span>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-brand-cyan hover:text-brand-green transition-colors duration-200"
          >
            <FaLinkedin size={14} />
            LinkedIn
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-brand-cyan hover:text-brand-green transition-colors duration-200"
          >
            <FaInstagram size={14} />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
