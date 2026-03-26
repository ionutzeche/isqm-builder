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
              </div>
              {error && <div className="text-sm text-rose-600 bg-rose-50 rounded-xl p-3">{error}</div>}
              <Button className="rounded-2xl w-full" type="submit">Set password and continue</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="rounded-3xl w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-4"><ShieldCheck className="h-7 w-7" /></div>
          <CardTitle>ISQM-1 Builder</CardTitle>
          <CardDescription>CLA Romania · Quality Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
              <Input className="rounded-2xl" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.name@cla.com.ro" autoFocus />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <Input className="rounded-2xl" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            {error && <div className="text-sm text-rose-600 bg-rose-50 rounded-xl p-3">{error}</div>}
            <Button className="rounded-2xl w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          </form>
          <div className="text-center text-xs text-slate-400 mt-6">Authorised CLA Romania staff only</div>
        </CardContent>
      </Card>
    </div>
  );
}
