import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';
import api from '@/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password change state
  const [mustChange, setMustChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (data.must_change_password) {
        setToken(data.token);
        setUserName(data.user.name);
        localStorage.setItem('isqm_token', data.token);
        setMustChange(true);
      } else {
        localStorage.setItem('isqm_token', data.token);
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    try {
      await api.post('/api/auth/change-password', { new_password: newPassword });
      const { data } = await api.get('/api/auth/me');
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  }

  if (mustChange) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="rounded-3xl w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-4"><ShieldCheck className="h-7 w-7" /></div>
            <CardTitle>Welcome, {userName}</CardTitle>
            <CardDescription>Please set your own password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">New password</label>
                <Input className="rounded-2xl" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" autoFocus />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Confirm password</label>
                <Input className="rounded-2xl" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Type it again" />
                {confirmPassword.length > 0 && (
                  <div className={`text-xs mt-1.5 ${newPassword === confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </div>
                )}
                {newPassword.length > 0 && newPassword.length < 6 && (
                  <div className="text-xs mt-1 text-amber-600">Password must be at least 6 characters ({6 - newPassword.length} more needed)</div>
                )}
              </div>
              {error && <div className="text-sm text-rose-600 bg-rose-50 rounded-xl p-3">{error}</div>}
              <Button className="rounded-2xl w-full" type="submit" disabled={newPassword.length < 6 || newPassword !== confirmPassword}>Set password and continue</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <img src="https://www.claglobal.com/media/z5ymuotz/cla-global-logo-0902.png" alt="CLA" className="h-8 brightness-0 invert mb-12" />
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">ISQM-1<br />Builder</h1>
          <p className="text-slate-400 mt-4 text-lg max-w-md leading-relaxed">Build, maintain, and review your quality management system in one structured workspace.</p>
          <div className="mt-10 space-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span>Use your @cla.com.ro email</span></div>
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span>First login requires password change</span></div>
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span>Your entries feed the annual assessment and documentation</span></div>
          </div>
        </div>
        <div className="relative rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-slate-400">
          Need help? Contact the audit team lead or use <a href="https://app.cla.com.ro/feedback/" className="text-amber-400 hover:text-amber-300" target="_blank" rel="noopener">AI Hub Feedback</a>.
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="rounded-3xl w-full max-w-md shadow-2xl bg-white border-slate-200">
          <CardHeader className="text-center">
            <img src="https://www.claglobal.com/media/z5ymuotz/cla-global-logo-0902.png" alt="CLA" className="h-6 mx-auto mb-4 lg:hidden" />
            <CardTitle className="text-slate-900">Sign in</CardTitle>
            <CardDescription>Use your CLA email and password to access the ISQM-1 Builder.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Work email <span className="text-rose-500">*</span></label>
                <Input className="rounded-2xl" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@cla.com.ro" autoFocus />
                <p className="text-xs text-slate-500 mt-1">Use your CLA work email address.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Password <span className="text-rose-500">*</span></label>
                <Input className="rounded-2xl" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
                <p className="text-xs text-slate-500 mt-1">Your initial password may be temporary and will require a change on first login.</p>
              </div>
              {error && <div className="text-sm text-rose-600 bg-rose-50 rounded-xl p-3">We couldn't sign you in. Check your email and password, or contact support.</div>}
              <Button className="rounded-2xl w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
            </form>
            <div className="text-center text-xs text-slate-400 mt-6">First time here? Sign in with the temporary password you received.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
