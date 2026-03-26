import { cn } from '@/lib/utils';
export function Table({ className, ...props }) { return <table className={cn('w-full text-sm', className)} {...props} />; }
export function TableHeader({ className, ...props }) { return <thead className={cn(className)} {...props} />; }
export function TableBody({ className, ...props }) { return <tbody className={cn(className)} {...props} />; }
export function TableRow({ className, ...props }) { return <tr className={cn('border-b border-slate-100 transition hover:bg-slate-50', className)} {...props} />; }
export function TableHead({ className, ...props }) { return <th className={cn('px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider', className)} {...props} />; }
export function TableCell({ className, ...props }) { return <td className={cn('px-4 py-3', className)} {...props} />; }
