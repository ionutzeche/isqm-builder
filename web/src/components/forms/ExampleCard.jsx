export default function ExampleCard({ title = 'Example entry', fields = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</div>
      <div className="space-y-2">
        {fields.map(f => (
          <div key={f.label}>
            <div className="text-xs text-slate-500">{f.label}</div>
            <div className="text-sm text-slate-700 italic">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
