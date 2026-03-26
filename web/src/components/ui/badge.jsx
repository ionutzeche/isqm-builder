import { cn } from '@/lib/utils';
export function Badge({ className, variant, ...props }) {
  return <span className={cn('inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full', variant === 'outline' ? 'border border-slate-200 text-slate-600' : 'bg-slate-100 text-slate-700', className)} {...props} />;
}
