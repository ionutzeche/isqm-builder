import { cn } from '@/lib/utils';
export function Card({ className, ...props }) { return <div className={cn('bg-white border border-slate-200 shadow-sm', className)} {...props} />; }
export function CardHeader({ className, ...props }) { return <div className={cn('p-6', className)} {...props} />; }
export function CardTitle({ className, ...props }) { return <h3 className={cn('text-lg font-semibold text-slate-900', className)} {...props} />; }
export function CardDescription({ className, ...props }) { return <p className={cn('text-sm text-slate-500 mt-1', className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn('p-6 pt-0', className)} {...props} />; }
