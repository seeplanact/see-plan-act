import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineMail,
  HiOutlinePlusCircle,
  HiOutlineLogout,
  HiMenuAlt3,
  HiX,
} from 'react-icons/hi';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineViewGrid, end: true },
  { to: '/admin/blogs', label: 'All Blogs', icon: HiOutlineDocumentText },
  { to: '/admin/blogs/new', label: 'New Blog', icon: HiOutlinePlusCircle },
  { to: '/admin/courses', label: 'All Courses', icon: HiOutlineAcademicCap },
  { to: '/admin/courses/new', label: 'New Course', icon: HiOutlinePlusCircle },
  { to: '/admin/contacts', label: 'Contacts', icon: HiOutlineMail },
];

const SidebarLink = ({ to, label, icon: Icon, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm transition-all duration-150 border
       ${isActive
        ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
        : 'text-white/50 hover:text-white hover:bg-white/5 border-transparent'
      }`
    }
  >
    <Icon size={16} />
    {label}
  </NavLink>
);

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-brand-border">
        <p className="font-display font-bold text-base tracking-widest">
          <span className="text-white">SEE</span>
          <span className="text-brand-cyan">PLAN</span>
          <span className="text-white">ACT</span>
        </p>
        <p className="text-white/25 font-mono text-xs mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => (
          <SidebarLink key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="px-4 py-4 border-t border-brand-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-white/70 font-body text-sm truncate">{admin?.name}</p>
          <p className="text-white/25 font-mono text-xs truncate">{admin?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-white/40
                     hover:text-red-400 hover:bg-red-400/5 font-body text-sm transition-all
                     duration-150 border border-transparent"
        >
          <HiOutlineLogout size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-brand-border bg-brand-card flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-56 bg-brand-card border-r border-brand-border z-50 md:hidden flex flex-col"
              initial={{ x: -224 }}
              animate={{ x: 0 }}
              exit={{ x: -224 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-card">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <HiMenuAlt3 size={20} />
          </button>
          <p className="font-display font-bold text-sm tracking-widest">
            <span className="text-white">SEE</span>
            <span className="text-brand-cyan">PLAN</span>
            <span className="text-white">ACT</span>
          </p>
          <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors">
            <HiOutlineLogout size={18} />
          </button>
        </div>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}