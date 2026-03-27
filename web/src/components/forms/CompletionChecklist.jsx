export default function CompletionChecklist({ items = [] }) {
  const done = items.filter(i => i.done).length;
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Required to save</div>
      <div className="text-xs text-slate-500 mb-3">{done} of {items.length} complete</div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${item.done ? 'bg-emerald-500/20 text-emerald-600' : 'bg-white text-slate-600'}`}>
              {item.done ? '✓' : '·'}
            </div>
            <span className={item.done ? 'text-slate-400' : 'text-slate-700'}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
