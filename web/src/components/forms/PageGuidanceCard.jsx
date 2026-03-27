import { cn } from '@/lib/utils';

export default function PageGuidanceCard({ purpose, required, example, mistakes, className }) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-6', className)}>
      <div className="grid gap-4 lg:grid-cols-3">
        {purpose && (
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">What this page is for</div>
            <div className="text-sm text-slate-700 leading-relaxed">{purpose}</div>
          </div>
        )}
        {required && (
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">What you must do</div>
            <div className="text-sm text-slate-700 leading-relaxed">{required}</div>
          </div>
        )}
        {example && (
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Good entry example</div>
            <div className="text-sm text-slate-400 italic leading-relaxed">"{example}"</div>
          </div>
        )}
      </div>
      {mistakes && mistakes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Common mistakes</div>
          <div className="flex flex-wrap gap-2">
            {mistakes.map((m, i) => <span key={i} className="text-xs bg-white text-slate-400 rounded-full px-3 py-1">{m}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
