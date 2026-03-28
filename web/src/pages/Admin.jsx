import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RotateCcw, Shield } from 'lucide-react';
import api from '@/api';

const VALID_ROLES = ['admin', 'quality_partner', 'engagement_partner', 'manager', 'staff', 'viewer'];

const roleLabels = {
  admin: 'Admin',
  quality_partner: 'Quality Partner',
  engagement_partner: 'Engagement Partner',
  manager: 'Manager',
  staff: 'Staff',
  viewer: 'Viewer'
};

const roleColor = (r) => {
  const map = {
    admin: 'bg-slate-900 text-white',
    quality_partner: 'bg-blue-100 text-blue-700',
    engagement_partner: 'bg-indigo-100 text-indigo-700',
    manager: 'bg-amber-100 text-amber-700',
    staff: 'bg-emerald-100 text-emerald-700',
    viewer: 'bg-slate-100 text-slate-600'
  };
  return map[r] || 'bg-slate-100 text-slate-600';
};

const permissions = [
  { role: 'Admin', view: true, edit: true, approve: true, export_: true, admin: true },
  { role: 'Quality Partner', view: true, edit: true, approve: true, export_: true, admin: false },
  { role: 'Engagement Partner', view: true, edit: true, approve: true, export_: false, admin: false },
  { role: 'Manager', view: true, edit: true, approve: false, export_: true, admin: false },
  { role: 'Staff', view: true, edit: true, approve: false, export_: false, admin: false },
  { role: 'Viewer', view: true, edit: false, approve: false, export_: false, admin: false },
];

export default function Admin() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // user id being saved
  const [toast, setToast] = useState('');

  const loadUsers = useCallback(() => {
    setLoading(true);
    api.get('/api/auth/users')
      .then(r => { setUsers(r.data || []); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function changeRole(userId, newRole) {
    setSaving(userId);
    api.put(`/api/auth/users/${userId}/role`, { role: newRole })
      .then(r => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showToast(`Role updated to ${roleLabels[newRole]}`);
        setSaving(null);
      })
      .catch(err => {
        showToast(err.response?.data?.error || 'Failed to update role');
        setSaving(null);
      });
  }

  function resetPassword(userId, userName) {
    if (!confirm(`Reset password for ${userName}? They will need to set a new password on next login.`)) return;
    api.post(`/api/auth/users/${userId}/reset-password`)
      .then(() => showToast(`Password reset for ${userName}`))
      .catch(err => showToast(err.response?.data?.error || 'Failed to reset password'));
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500 mb-2">Admin</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Users, roles, and system settings</h1>
          <p className="text-slate-600 mt-2 max-w-3xl">Manage who can view, edit, approve, and export. Every action is logged for auditability.</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="rounded-2xl h-auto p-1">
          <TabsTrigger value="users" className="rounded-xl">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="roles" className="rounded-xl">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="rounded-3xl overflow-hidden">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team members</CardTitle>
                <CardDescription>{users.length} users with access to ISQM-1 Builder</CardDescription>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={loadUsers} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
              ) : users.length === 0 ? (
                <div className="text-center p-12 text-slate-400">
                  <Shield className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <div>No users found. Run the seed endpoint first.</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-sm font-mono text-slate-500">{u.email}</TableCell>
                        <TableCell>
                          <select
                            value={u.role}
                            onChange={e => changeRole(u.id, e.target.value)}
                            disabled={saving === u.id}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white"
                          >
                            {VALID_ROLES.map(r => (
                              <option key={r} value={r}>{roleLabels[r]}</option>
                            ))}
                          </select>
                          {saving === u.id && <Loader2 className="h-3 w-3 animate-spin inline ml-2 text-slate-400" />}
                        </TableCell>
                        <TableCell>
                          {u.must_change_password ? (
                            <Badge className="rounded-full px-3 py-1 bg-amber-100 text-amber-700">Must change</Badge>
                          ) : (
                            <Badge className="rounded-full px-3 py-1 bg-emerald-100 text-emerald-700">Set</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-xs"
                            onClick={() => resetPassword(u.id, u.name)}
                          >
                            Reset password
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle>Permission matrix</CardTitle>
              <CardDescription>Role-based access control for ISQM-1 system operations.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Approve</TableHead>
                    <TableHead>Export</TableHead>
                    <TableHead>Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map(p => (
                    <TableRow key={p.role}>
                      <TableCell className="font-medium">{p.role}</TableCell>
                      {[p.view, p.edit, p.approve, p.export_, p.admin].map((v, i) => (
                        <TableCell key={i}>
                          {v ? <span className="text-emerald-600 font-bold">Yes</span> : <span className="text-slate-300">—</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-medium shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
}
