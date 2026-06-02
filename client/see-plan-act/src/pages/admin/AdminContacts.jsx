import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useFetch } from '../../hooks/useFetch.js';
import { adminContactsAPI } from '../../utils/adminApi.js';
import { HiOutlineMail, HiOutlineMailOpen, HiOutlineSearch, HiX } from 'react-icons/hi';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const STATUS_STYLE = {
  pending: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  read:    'text-white/40 border-white/10 bg-white/5',
  replied: 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/5',
};

export default function AdminContacts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [markingId, setMarkingId] = useState(null);

  const fetchContacts = useCallback(
    () => adminContactsAPI.getAll({ page, limit: 20, status: statusFilter }),
    [page, statusFilter]
  );

  const { data, loading, refetch } = useFetch(fetchContacts, [page, statusFilter]);
  const allContacts = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // Client-side search filter
  const contacts = search.trim()
    ? allContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.subject.toLowerCase().includes(search.toLowerCase())
      )
    : allContacts;

  const handleMarkRead = async (id) => {
    setMarkingId(id);
    try {
      await adminContactsAPI.markRead(id);
      toast.success('Marked as read');
      refetch();
      if (selected?._id === id) setSelected((s) => ({ ...s, status: 'read' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-white/30 font-mono text-xs tracking-widest uppercase mb-1">Inbox</p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Contact Messages</h1>
        {data && (
          <p className="text-white/30 font-mono text-xs mt-1">{data.total} total messages</p>
        )}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
          <input
            type="text"
            placeholder="Search by name, email or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field text-sm w-full sm:w-36"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand-border border-t-brand-cyan rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-sm p-12 text-center">
          <p className="text-white/30 font-body text-sm">No messages found.</p>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Message list */}
          <div className="flex-1 bg-brand-card border border-brand-border rounded-sm overflow-hidden">
            {contacts.map((contact, i) => (
              <motion.div
                key={contact._id}
                onClick={() => setSelected(contact)}
                className={`px-4 py-4 cursor-pointer transition-colors
                  ${i < contacts.length - 1 ? 'border-b border-brand-border' : ''}
                  ${selected?._id === contact._id ? 'bg-brand-cyan/5' : 'hover:bg-white/2'}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {contact.status === 'pending'
                        ? <HiOutlineMail size={14} className="text-amber-400 flex-shrink-0" />
                        : <HiOutlineMailOpen size={14} className="text-white/30 flex-shrink-0" />
                      }
                      <p className={`font-body text-sm truncate ${contact.status === 'pending' ? 'text-white font-medium' : 'text-white/60'}`}>
                        {contact.name}
                      </p>
                      <span className={`font-mono text-xs border px-1.5 py-0.5 rounded-sm flex-shrink-0 ${STATUS_STYLE[contact.status]}`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-white/50 font-body text-xs truncate pl-5">{contact.subject}</p>
                    <p className="text-white/25 font-mono text-xs mt-0.5 pl-5">{contact.email}</p>
                  </div>
                  <p className="text-white/20 font-mono text-xs flex-shrink-0">{formatDate(contact.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                className="hidden lg:flex flex-col w-80 xl:w-96 bg-brand-card border border-brand-border rounded-sm overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                  <p className="font-display font-semibold text-white text-sm truncate">{selected.name}</p>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-white/30 hover:text-white transition-colors ml-2 flex-shrink-0"
                  >
                    <HiX size={16} />
                  </button>
                </div>

                {/* Panel body */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                  <div>
                    <p className="font-mono text-xs text-white/30 uppercase tracking-wider mb-1">From</p>
                    <p className="font-body text-sm text-white">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="font-mono text-xs text-brand-cyan hover:underline">
                      {selected.email}
                    </a>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-white/30 uppercase tracking-wider mb-1">Subject</p>
                    <p className="font-body text-sm text-white">{selected.subject}</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-white/30 uppercase tracking-wider mb-1">Message</p>
                    <p className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-white/30 uppercase tracking-wider mb-1">Received</p>
                    <p className="font-mono text-xs text-white/50">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                {/* Panel actions */}
                <div className="px-5 py-4 border-t border-brand-border flex gap-2">
                  {selected.status === 'pending' && (
                    <button
                      onClick={() => handleMarkRead(selected._id)}
                      disabled={markingId === selected._id}
                      className="btn-outline text-xs flex items-center gap-1 disabled:opacity-50"
                    >
                      {markingId === selected._id
                        ? <span className="w-3 h-3 border border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin" />
                        : <HiOutlineMailOpen size={13} />
                      }
                      Mark as read
                    </button>
                  )}
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="btn-primary text-xs flex items-center gap-1"
                  >
                    <HiOutlineMail size={13} />
                    Reply
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mobile detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 bg-black/80 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="w-full bg-brand-card border-t border-brand-border rounded-t-lg max-h-[80vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                <p className="font-display font-semibold text-white">{selected.name}</p>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white">
                  <HiX size={18} />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <p className="font-mono text-xs text-white/30 mb-1">EMAIL</p>
                  <a href={`mailto:${selected.email}`} className="font-mono text-sm text-brand-cyan">{selected.email}</a>
                </div>
                <div>
                  <p className="font-mono text-xs text-white/30 mb-1">SUBJECT</p>
                  <p className="font-body text-sm text-white">{selected.subject}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-white/30 mb-1">MESSAGE</p>
                  <p className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  {selected.status === 'pending' && (
                    <button
                      onClick={() => handleMarkRead(selected._id)}
                      disabled={markingId === selected._id}
                      className="btn-outline text-xs disabled:opacity-50"
                    >
                      Mark as read
                    </button>
                  )}
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="btn-primary text-xs"
                  >
                    Reply
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && !search && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-brand-border text-white/40 text-sm font-mono hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-sm"
          >
            ← Prev
          </button>
          <span className="text-white/30 font-mono text-sm">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-brand-border text-white/40 text-sm font-mono hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}