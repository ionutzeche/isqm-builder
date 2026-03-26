import { cn } from '@/lib/utils';
export function Textarea({ className, ...props }) {
  return <textarea className={cn('w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-y', className)} {...props} />;
}
