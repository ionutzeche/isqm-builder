import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Admin() {
  const [tab, setTab] = useState('users');

  // Users are loaded from the seed — shown statically here
  const users = [
    { name: 'Laurentiu Vasile', email: 'laurentiu.vasile@cla.com.ro', role: 'admin', practice: 'Audit' },
    { name: 'Alina Ene', email: 'alina.ene@cla.com.ro', role: 'contributor', practice: 'Controlling' },
    { name: 'Qasim Ranjha', email: 'qasim.ranjha@cla.com.ro', role: 'contributor', practice: 'BPS' },
    { name: 'Marfa Arif', email: 'marfa.arif@cla.com.ro', role: 'contributor', practice: 'BPS' },
    { name: 'Roxana Olteanu', email: 'roxana.olteanu@cla.com.ro', role: 'contributor', practice: 'Audit' },
    { name: 'George Chiriac', email: 'george.chiriac@cla.com.ro', role: 'contributor', practice: 'Audit' },
  ];

  const roleColor = (r) => r === 'admin' ? 'bg-slate-900 text-white' : r === 'quality_partner' ? 'bg-blue-100 text-blue-700' : r === 'contributor' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600';

  const permissions = [
    { role: 'Admin', view: true, edit: true, approve: true, export_: true, admin: true },
    { role: 'Quality Partner', view: true, edit: true, approve: true, export_: true, admin: false },
    { role: 'Contributor', view: true, edit: true, approve: false, export_: true, admin: false },
    { role: 'Reviewer', view: true, edit: false, approve: true, export_: true, admin: false },
    { role: 'Viewer', view: true, edit: false, approve: false, export_: false, admin: false },
  ];

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
          <TabsTrigger value="log" className="rounded-xl">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Practice</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.email}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-sm font-mono">{u.email}</TableCell>
                      <TableCell><Badge className={`rounded-full px-3 py-1 ${roleColor(u.role)}`}>{u.role.replace('_', ' ')}</Badge></TableCell>
                      <TableCell className="text-sm">{u.practice}</TableCell>
                      <TableCell><Badge className="rounded-full px-3 py-1 bg-emerald-100 text-emerald-700">Active</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="rounded-3xl overflow-hidden">
            <CardHeader><CardTitle>Permission matrix</CardTitle><CardDescription>Role-based access control for ISQM-1 system operations.</CardDescription></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>View</TableHead><TableHead>Edit</TableHead><TableHead>Approve</TableHead><TableHead>Export</TableHead><TableHead>Admin</TableHead></TableRow></TableHeader>
                <TableBody>
                  {permissions.map(p => (
                    <TableRow key={p.role}>
                      <TableCell className="font-medium">{p.role}</TableCell>
                      {[p.view, p.edit, p.approve, p.export_, p.admin].map((v, i) => (
                        <TableCell key={i}>{v ? <span className="text-emerald-600 font-bold">Yes</span> : <span className="text-slate-300">—</span>}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log">
          <Card className="rounded-3xl">
            <CardHeader><CardTitle>Activity log</CardTitle><CardDescription>All changes tracked with user, timestamp, and before/after state.</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Database seeded', user: 'System', time: 'Just now', detail: '16 tables created, 8 ISQM components, 10 users' },
                  { action: 'User login', user: 'Ionut Zeche', time: 'Just now', detail: 'admin@cla.com.ro — role: admin' },
                ].map((e, i) => (
                  <div key={i} className="rounded-2xl border p-4 text-sm">
                    <div className="flex justify-between"><span className="font-medium text-slate-900">{e.action}</span><span className="text-slate-500 font-mono text-xs">{e.time}</span></div>
                    <div className="text-slate-500 mt-1">{e.user} — {e.detail}</div>
                  </div>
                ))}
                <div className="text-sm text-slate-400 text-center py-4">Full audit log available once operations begin.</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
