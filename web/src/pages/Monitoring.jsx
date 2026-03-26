import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/api';

export default function Monitoring() {
  const [activities, setActivities] = useState([]);
  const [tab, setTab] = useState('activities');
  const [showAdd, setShowAdd] = useState(false);
  const [newAct, setNewAct] = useState({ title: '', method: 'inspection', notes: '' });

  useEffect(() => { loadActivities(); }, []);

  async function loadActivities() {
    try { const { data } = await api.get('/api/monitoring'); setActivities(data); } catch (e) { console.error(e); }
  }

  async function addActivity() {
    if (!newAct.title) return;
    try {
      await api.post('/api/monitoring', { ...newAct, performed_at: new Date().toISOString().split('T')[0], result: 'pass' });
      setNewAct({ title: '', method: 'inspection', notes: '' });
      setShowAdd(false);
      loadActivities();
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  const resultColor = (r) => r === 'pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500 mb-2">Monitoring</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Track monitoring activities and findings</h1>
          <p className="text-slate-600 mt-2 max-w-3xl">Log cold file reviews, walkthroughs, inspections, and thematic reviews. Create deficiencies directly from findings.</p>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-2xl" onClick={() => setShowAdd(true)}>Log activity</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => setTab('findings')}>View findings</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: 'Activities logged', value: activities.length },
          { label: 'Issues found', value: activities.filter(a => a.result === 'issue_found').length },
          { label: 'Pass rate', value: activities.length ? Math.round(activities.filter(a => a.result === 'pass').length / activities.length * 100) + '%' : '—' },
          { label: 'Methods used', value: [...new Set(activities.map(a => a.method))].length },
        ].map(m => (
          <Card key={m.label} className="rounded-3xl"><CardContent className="p-5"><div className="text-sm text-slate-500">{m.label}</div><div className="text-2xl font-semibold mt-1">{m.value}</div></CardContent></Card>
        ))}
      </div>

      {showAdd && (
        <Card className="rounded-3xl mb-4">
          <CardHeader><CardTitle>Log monitoring activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input className="rounded-2xl" placeholder="Activity title — e.g. Cold file review Q1 2026 — BUSTEC audit" value={newAct.title} onChange={e => setNewAct({ ...newAct, title: e.target.value })} />
            <div className="flex gap-3">
              <select className="border rounded-xl px-3 py-2 text-sm flex-1" value={newAct.method} onChange={e => setNewAct({ ...newAct, method: e.target.value })}>
                <option value="inspection">Inspection</option><option value="walkthrough">Walkthrough</option><option value="analytics">Analytics</option><option value="thematic_review">Thematic review</option><option value="file_review">File review</option>
              </select>
              <select className="border rounded-xl px-3 py-2 text-sm" onChange={e => setNewAct({ ...newAct, result: e.target.value })} defaultValue="pass">
                <option value="pass">Pass</option><option value="issue_found">Issue found</option>
              </select>
            </div>
            <Textarea className="rounded-2xl" placeholder="Notes, observations, and findings" value={newAct.notes} onChange={e => setNewAct({ ...newAct, notes: e.target.value })} />
            <div className="flex gap-2">
              <Button className="rounded-2xl" onClick={addActivity}>Save activity</Button>
              <Button variant="outline" className="rounded-2xl" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Activity</TableHead><TableHead>Method</TableHead><TableHead>Component</TableHead><TableHead>Performed</TableHead><TableHead>Result</TableHead><TableHead>Notes</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {activities.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No monitoring activities logged yet. Click "Log activity" to record a review.</TableCell></TableRow>}
              {activities.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell><Badge variant="outline" className="rounded-full">{a.method?.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="text-sm">{a.component_name || '—'}</TableCell>
                  <TableCell className="text-sm font-mono">{a.performed_at?.split('T')[0] || '—'}</TableCell>
                  <TableCell><Badge className={`rounded-full px-3 py-1 ${resultColor(a.result)}`}>{a.result === 'issue_found' ? 'Issue found' : 'Pass'}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-500 max-w-xs truncate">{a.notes || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
