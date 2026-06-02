import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SEO from '../components/SEO.jsx';
import { contactAPI } from '../utils/api.js';

const INITIAL = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const { data } = await contactAPI.submit(form);
      toast.success(data.message || 'Message sent!');
      setForm(INITIAL);
      setErrors({});
    } catch (err) {
      toast.error(err.message || 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, name, type = 'text', rows }) => (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs text-white/40 tracking-wider uppercase" htmlFor={name}>
        {label}
      </label>
      {rows ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={form[name]}
          onChange={handleChange}
          placeholder={`Your ${label.toLowerCase()}...`}
          className={`input-field resize-none ${errors[name] ? 'border-red-500/60' : ''}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          placeholder={`Your ${label.toLowerCase()}...`}
          className={`input-field ${errors[name] ? 'border-red-500/60' : ''}`}
        />
      )}
      {errors[name] && (
        <p className="text-red-400 font-mono text-xs">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <>
      <SEO title="Contact" description="Get in touch with the SeePlanAct team." />

      <div className="pt-24 pb-20">
        <div className="container-custom max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-brand-cyan font-mono text-sm tracking-widest uppercase block mb-4">
              Contact
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-4">
              Get in touch
            </h1>
            <p className="text-white/40 font-body text-base mb-10">
              Questions, collaborations, or just want to say hello — we&apos;d love to hear from you.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
              </div>
              <Field label="Subject" name="subject" />
              <Field label="Message" name="message" rows={6} />

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary self-start disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
