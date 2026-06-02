import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { adminAuthAPI } from '../../utils/adminApi.js';

export default function AdminLogin() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }             = useAdminAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    try {
      const { data } = await adminAuthAPI.login(form);
      // Pass BOTH token and admin object — context stores both
      login(data.token, data.admin);
      toast.success(`Welcome back, ${data.admin.name}`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-radial-green opacity-40 pointer-events-none" />

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <p className="font-display font-bold text-xl tracking-widest mb-1">
            <span className="text-white">SEE</span>
            <span className="text-brand-cyan">PLAN</span>
            <span className="text-white">ACT</span>
          </p>
          <p className="text-white/30 font-mono text-xs tracking-widest uppercase">Admin Console</p>
        </div>

        <div className="bg-brand-card border border-brand-border p-8 rounded-sm">
          <h1 className="font-display font-semibold text-white text-xl mb-6">Sign in</h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@seeplanact.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-white/40 tracking-wider uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 font-mono text-xs transition-colors"
                >
                  {showPw ? 'hide' : 'show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-white/20 font-mono text-xs text-center mt-6">
          SeePlanAct Admin — restricted access
        </p>
      </motion.div>
    </div>
  );
}