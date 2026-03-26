import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/api';

export default function Deficiencies() {
  const [deficiencies, setDeficiencies] = useState([]);
  const [remediations, setRemediations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showRemediation, setShowRemediation] = useState(null);
  const [newDef, setNewDef] = useState({ title: '', description: '', severity: 'medium', root_cause: '', due_date: '' });
  const [newRem, setNewRem] = useState({ description: '', target_date: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [d, r] = await Promise.all([api.get('/api/monitoring/deficiencies'), api.get('/api/monitoring/remediation')]);
      setDeficiencies(d.data);
      setRemediations(r.data);
    } catch (e) { console.error(e); }
  }

  async function addDeficiency() {
    if (!newDef.title) return;
    try {
      await api.post('/api/monitoring/deficiencies', newDef);
      setNewDef({ title: '', description: '', severity: 'medium', root_cause: '', due_date: '' });
      setShowAdd(false);
      loadData();
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function addRemediation(defId) {
    if (!newRem.description) return;
    try {
      await api.post('/api/monitoring/remediation', { deficiency_id: defId, ...newRem });
      setNewRem({ description: '', target_date: '' });
      setShowRemediation(null);
      loadData();
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function updateDefStatus(id, status) {
    try { await api.put(`/api/monitoring/deficiencies/${id}`, { status }); loadData(); } catch (e) { console.error(e); }
  }

  async function completeRemediation(id) {
    try { await api.put(`/api/monitoring/remediation/${id}`, { status: 'completed', completed_at: new Date().toISOString() }); loadData(); } catch (e) { console.error(e); }
  }

  const sevColor = (s) => s === 'high' ? 'bg-rose-100 text-rose-700' : s === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
  const statusColor = (s) => s === 'open' ? 'bg-rose-100 text-rose-700' : s === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
  const open = deficiencies.filter(d => d.status === 'open').length;
  const overdue = deficiencies.filter(d => d.due_date && new Date(d.due_date) < new Date() && d.status !== 'closed').length;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500 mb-2">Deficiencies</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Track and remediate quality deficiencies</h1>
          <p className="text-slate-600 mt-2 max-w-3xl">Every deficiency must have a severity, root cause, owner, remediation plan, and closure evidence. Nothing gets lost.</p>
        </div>
        <Button className="rounded-2xl" onClick={() => setShowAdd(true)}>Add deficiency</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="rounded-3xl"><CardContent className="p-5"><div className="text-sm text-slate-500">Total</div><div className="text-2xl font-semibold mt-1">{deficiencies.length}</div></CardContent></Card>
        <Card className="rounded-3xl"><CardContent className="p-5"><div className="text-sm text-slate-500">Open</div><div className="text-2xl font-semibold mt-1 text-rose-600">{open}</div></CardContent></Card>
        <Card className="rounded-3xl"><CardContent className="p-5"><div className="text-sm text-slate-500">Overdue</div><div className="text-2xl font-semibold mt-1 text-rose-600">{overdue}</div></CardContent></Card>
        <Card className="rounded-3xl"><CardContent className="p-5"><div className="text-sm text-slate-500">Closed</div><div className="text-2xl font-semibold mt-1 text-emerald-600">{deficiencies.filter(d => d.status === 'closed').length}</div></CardContent></Card>
      </div>

      {showAdd && (
        <Card className="rounded-3xl mb-4">
          <CardHeader><CardTitle>Log deficiency</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input className="rounded-2xl" placeholder="Deficiency title" value={newDef.title} onChange={e => setNewDef({ ...newDef, title: e.target.value })} />
            <Textarea className="rounded-2xl" placeholder="Description — what was found and what is the impact" value={newDef.description} onChange={e => setNewDef({ ...newDef, description: e.target.value })} />
            <div className="flex gap-3">
              <select className="border rounded-xl px-3 py-2 text-sm" value={newDef.severity} onChange={e => setNewDef({ ...newDef, severity: e.target.value })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
              <Input className="rounded-2xl" placeholder="Root cause" value={newDef.root_cause} onChange={e => setNewDef({ ...newDef, root_cause: e.target.value })} />
              <Input className="rounded-2xl" type="date" value={newDef.due_date} onChange={e => setNewDef({ ...newDef, due_date: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button className="rounded-2xl" onClick={addDeficiency}>Save</Button>
              <Button variant="outline" className="rounded-2xl" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Deficiency</TableHead><TableHead>Severity</TableHead><TableHead>Component</TableHead><TableHead>Owner</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {deficiencies.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-500">No deficiencies logged. This is either very good or very early.</TableCell></TableRow>}
              {deficiencies.map(d => (
                <React.Fragment key={d.id}>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">{d.title}</div>
                      {d.description && <div className="text-xs text-slate-500 mt-1 line-clamp-1">{d.description}</div>}
                      {d.root_cause && <div className="text-xs text-slate-400 mt-1">Root cause: {d.root_cause}</div>}
                    </TableCell>
                    <TableCell><Badge className={`rounded-full px-3 py-1 ${sevColor(d.severity)}`}>{d.severity}</Badge></TableCell>
                    <TableCell className="text-sm">{d.component_name || '—'}</TableCell>
                    <TableCell className="text-sm">{d.owner_name || '—'}</TableCell>
                    <TableCell className="text-sm font-mono">{d.due_date?.split('T')[0] || '—'}</TableCell>
                    <TableCell>
                      <select className="text-xs border rounded-lg px-2 py-1" value={d.status} onChange={e => updateDefStatus(d.id, e.target.value)}>
                        <option value="open">Open</option><option value="in_progress">In progress</option><option value="closed">Closed</option>
                      </select>
                    </TableCell>
                    <TableCell><Button variant="outline" className="rounded-xl text-xs" onClick={() => setShowRemediation(showRemediation === d.id ? null : d.id)}>Remediate</Button></TableCell>
                  </TableRow>
                  {showRemediation === d.id && (
                    <TableRow><TableCell colSpan={7} className="bg-slate-50">
                      <div className="p-3 space-y-3">
                        <div className="text-sm font-medium text-slate-700">Remediation actions</div>
                        {remediations.filter(r => r.deficiency_id === d.id).map(r => (
                          <div key={r.id} className="flex items-center justify-between p-2 bg-white rounded-xl border text-sm">
                            <div>{r.description}</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-slate-500">{r.target_date?.split('T')[0]}</span>
                              <Badge className={`rounded-full px-2 py-0.5 text-xs ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</Badge>
                              {r.status !== 'completed' && <Button variant="outline" className="rounded-lg text-xs px-2 py-0.5" onClick={() => completeRemediation(r.id)}>Complete</Button>}
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 items-end">
                          <Input className="rounded-xl flex-1" placeholder="Remediation action" value={newRem.description} onChange={e => setNewRem({ ...newRem, description: e.target.value })} />
                          <Input className="rounded-xl w-40" type="date" value={newRem.target_date} onChange={e => setNewRem({ ...newRem, target_date: e.target.value })} />
                          <Button className="rounded-xl" onClick={() => addRemediation(d.id)}>Add</Button>
                        </div>
                      </div>
                    </TableCell></TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
