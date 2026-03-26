import { cn } from '@/lib/utils';
const variants = {
  default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-100',
};
const sizes = { default: 'px-4 py-2 text-sm', sm: 'px-3 py-1.5 text-xs', icon: 'p-2' };
export function Button({ className, variant = 'default', size = 'default', ...props }) {
  return <button className={cn('inline-flex items-center justify-center font-medium transition rounded-xl', variants[variant], sizes[size], className)} {...props} />;
}
