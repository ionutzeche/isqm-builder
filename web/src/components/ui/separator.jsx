import { cn } from '@/lib/utils';
export function Separator({ className, ...props }) { return <hr className={cn('border-slate-200', className)} {...props} />; }
