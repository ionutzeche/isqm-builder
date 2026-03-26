export default function StickyActionBar({ status, children }) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between shadow-lg">
      <div className="text-sm text-slate-500">{status}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
