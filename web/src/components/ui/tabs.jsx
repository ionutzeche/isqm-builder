import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
const TabsCtx = createContext();
export function Tabs({ value, onValueChange, className, children, ...props }) {
  const [val, setVal] = useState(value);
  const current = value !== undefined ? value : val;
  const change = onValueChange || setVal;
  return <TabsCtx.Provider value={{ current, change }}><div className={cn(className)} {...props}>{children}</div></TabsCtx.Provider>;
}
export function TabsList({ className, children, ...props }) { return <div className={cn('flex gap-1 bg-slate-100 p-1 rounded-xl', className)} {...props}>{children}</div>; }
export function TabsTrigger({ value, className, children, ...props }) {
  const { current, change } = useContext(TabsCtx);
  return <button onClick={() => change(value)} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition', current === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700', className)} {...props}>{children}</button>;
}
export function TabsContent({ value, className, children, ...props }) {
  const { current } = useContext(TabsCtx);
  if (current !== value) return null;
  return <div className={cn(className)} {...props}>{children}</div>;
}
