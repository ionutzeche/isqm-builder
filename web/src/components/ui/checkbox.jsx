import { cn } from '@/lib/utils';
export function Checkbox({ className, ...props }) {
  return <input type="checkbox" className={cn('h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10', className)} {...props} />;
}
