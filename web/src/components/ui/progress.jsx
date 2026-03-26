import { cn } from '@/lib/utils';
export function Progress({ value = 0, className, ...props }) {
  return <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', className)} {...props}>
    <div className="bg-slate-900 rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: '100%' }} />
  </div>;
}
