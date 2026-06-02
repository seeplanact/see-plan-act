const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-8 h-8 border-2 border-brand-border border-t-brand-cyan rounded-full animate-spin" />
    <p className="text-white/40 font-body text-sm">{text}</p>
  </div>
);

export default Loader;
