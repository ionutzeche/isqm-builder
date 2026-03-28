import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageGuidanceCard from '@/components/forms/PageGuidanceCard';
import FieldLabel from '@/components/forms/FieldLabel';
import HelperText from '@/components/forms/HelperText';
import CompletionChecklist from '@/components/forms/CompletionChecklist';
import ExampleCard from '@/components/forms/ExampleCard';
import ValidationBanner from '@/components/forms/ValidationBanner';
import StickyActionBar from '@/components/forms/StickyActionBar';
import api from '@/api';

export default function Deficiencies() {
  const [deficiencies, setDeficiencies] = useState([]);
  const [remediations, setRemediations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showRemediation, setShowRemediation] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', severity: 'medium', root_cause: '', due_date: '' });
  const [newRem, setNewRem] = useState({ description: '', target_date: '' });
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [d, r] = await Promise.all([api.get('/api/monitoring/deficiencies'), api.get('/api/monitoring/remediation')]);
      setDeficiencies(d.data); setRemediations(r.data);
    } catch (e) { console.error(e); }
  }

  async function addDeficiency() {
    if (!form.title || !form.severity) { setShowValidation(true); return; }
    try { await api.post('/api/monitoring/deficiencies', form); setForm({ title: '', description: '', severity: 'medium', root_cause: '', due_date: '' }); setShowAdd(false); setShowValidation(false); loadData(); } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function addRemediation(defId) {
    if (!newRem.description) return;
    try { await api.post('/api/monitoring/remediation', { deficiency_id: defId, ...newRem }); setNewRem({ description: '', target_date: '' }); setShowRemediation(null); loadData(); } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function updateDefStatus(id, status) {
    if (status === 'closed') {
      const pendingRemediations = remediations.filter(r => r.deficiency_id === id && r.status !== 'completed');
      if (pendingRemediations.length > 0) {
        alert(`Cannot close: ${pendingRemediations.length} remediation action${pendingRemediations.length > 1 ? 's' : ''} still pending. Complete all remediation actions before closing this deficiency.`);
        return;
      }
    }
    try { await api.put(`/api/monitoring/deficiencies/${id}`, { status }); loadData(); } catch (e) { console.error(e); }
  }
  async function completeRemediation(id) { try { await api.put(`/api/monitoring/remediation/${id}`, { status: 'completed', completed_at: new Date().toISOString() }); loadData(); } catch (e) { console.error(e); } }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const sevColor = (s) => s === 'high' ? 'bg-rose-100 text-rose-600' : s === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-600';
  const open = deficiencies.filter(d => d.status === 'open').length;
  const overdue = deficiencies.filter(d => d.due_date && new Date(d.due_date) < new Date() && d.status !== 'closed').length;

  const formChecklist = [
    { label: 'Deficiency title', done: !!form.title },
    { label: 'Severity level', done: !!form.severity },
    { label: 'Root cause', done: !!form.root_cause },
    { label: 'Due date', done: !!form.due_date },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-slate-500 mb-2">Deficiencies</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Track and remediate quality deficiencies</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">A deficiency is a quality issue that needs fixing. Not a risk, not a finding — a confirmed problem with the quality system.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-700" onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide guide' : 'How to complete this page'}</Button>
          <Button className="rounded-xl" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add deficiency'}</Button>
        </div>
      </div>

      {showHelp && (
        <PageGuidanceCard
          purpose="Log quality deficiencies — confirmed problems with the quality system found through monitoring, inspection, or other means."
          required="Title, severity (low/medium/high), root cause, and remediation due date. Each deficiency needs at least one remediation action."
          example="Audit file review notes not cleared before sign-off on engagement A — identified during Q1 cold file review."
          mistakes={['Confusing a deficiency with a risk (a deficiency is a confirmed issue, not a potential one)', 'No root cause (makes remediation guesswork)', 'No due date (deficiency stays open forever)', 'Closing without evidence of remediation']}
        />
      )}

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="rounded-2xl border-slate-200 bg-white"><CardContent className="p-4"><div className="text-sm text-slate-500">Total</div><div className="text-2xl font-semibold mt-1 text-slate-900">{deficiencies.length}</div></CardContent></Card>
        <Card className="rounded-2xl border-slate-200 bg-white"><CardContent className="p-4"><div className="text-sm text-slate-500">Open</div><div className="text-2xl font-semibold mt-1 text-rose-600">{open}</div></CardContent></Card>
        <Card className="rounded-2xl border-slate-200 bg-white"><CardContent className="p-4"><div className="text-sm text-slate-500">Overdue</div><div className="text-2xl font-semibold mt-1 text-rose-600">{overdue}</div></CardContent></Card>
        <Card className="rounded-2xl border-slate-200 bg-white"><CardContent className="p-4"><div className="text-sm text-slate-500">Closed</div><div className="text-2xl font-semibold mt-1 text-emerald-600">{deficiencies.filter(d => d.status === 'closed').length}</div></CardContent></Card>
      </div>

      {showAdd && (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr] mb-6">
          <Card className="rounded-2xl border-slate-200 bg-white">
            <CardHeader><CardTitle className="text-slate-900 text-sm uppercase tracking-wider">Log deficiency</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ValidationBanner show={showValidation && !form.title} message="Deficiency title is required." />
              <div>
                <FieldLabel label="Deficiency title" required />
                <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="e.g. Audit file review notes not cleared before sign-off on engagement A" value={form.title} onChange={e => set('title', e.target.value)} />
                <HelperText>Describe the specific quality issue found. Be precise about what happened.</HelperText>
              </div>
              <div>
                <FieldLabel label="Description" />
                <Textarea className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-20" placeholder="What was the issue? What is the impact on quality?" value={form.description} onChange={e => set('description', e.target.value)} />
                <HelperText>Explain the issue and its impact on the firm's quality system.</HelperText>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <FieldLabel label="Severity" required />
                  <select className="mt-1 w-full rounded-xl bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm" value={form.severity} onChange={e => set('severity', e.target.value)}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                  <HelperText>High = significant risk to quality. Low = minor process gap.</HelperText>
                </div>
                <div>
                  <FieldLabel label="Root cause" required />
                  <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="Why did this happen?" value={form.root_cause} onChange={e => set('root_cause', e.target.value)} />
                  <HelperText>The underlying reason — not the symptom.</HelperText>
                </div>
                <div>
                  <FieldLabel label="Remediation due date" required />
                  <Input type="date" className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
                  <HelperText>When must this be fixed?</HelperText>
                </div>
              </div>
              <StickyActionBar status={`${formChecklist.filter(c => c.done).length} of ${formChecklist.length} fields complete`}>
                <Button className="rounded-xl" onClick={addDeficiency}>Save deficiency</Button>
              </StickyActionBar>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <CompletionChecklist items={formChecklist} />
            <ExampleCard title="Good deficiency entry" fields={[
              { label: 'Title', value: 'Audit file review notes not cleared before sign-off' },
              { label: 'Severity', value: 'Moderate — affects file quality but not audit opinion' },
              { label: 'Root cause', value: 'No automated alert for uncleared review notes in CaseWare' },
              { label: 'Remediation', value: 'Configure CaseWare alert + re-brief team on clearance process' },
            ]} />
          </div>
        </div>
      )}

      <Card className="rounded-2xl border-slate-200 bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="border-slate-200">
              <TableHead className="text-slate-500">Deficiency</TableHead><TableHead className="text-slate-500">Severity</TableHead><TableHead className="text-slate-500">Owner</TableHead><TableHead className="text-slate-500">Due</TableHead><TableHead className="text-slate-500">Status</TableHead><TableHead className="text-slate-500"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {deficiencies.length === 0 && <TableRow className="border-slate-200"><TableCell colSpan={6} className="text-center py-8 text-slate-600">No deficiencies logged. This is either very good or very early in the process.</TableCell></TableRow>}
              {deficiencies.map(d => (
                <React.Fragment key={d.id}>
                  <TableRow className="border-slate-200 hover:bg-slate-50">
                    <TableCell>
                      <div className="font-medium text-slate-900">{d.title}</div>
                      {d.root_cause && <div className="text-xs text-slate-600 mt-1">Root cause: {d.root_cause}</div>}
                    </TableCell>
                    <TableCell><Badge className={`rounded-full px-3 py-1 ${sevColor(d.severity)}`}>{d.severity}</Badge></TableCell>
                    <TableCell className="text-sm text-slate-400">{d.owner_name || '—'}</TableCell>
                    <TableCell className="text-sm font-mono text-slate-400">{d.due_date?.split('T')[0] || '—'}</TableCell>
                    <TableCell>
                      <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700" value={d.status} onChange={e => updateDefStatus(d.id, e.target.value)}>
                        <option value="open">Open</option><option value="in_progress">In progress</option><option value="closed">Closed</option>
                      </select>
                    </TableCell>
                    <TableCell><Button variant="outline" className="rounded-xl text-xs border-slate-200 text-slate-400" onClick={() => setShowRemediation(showRemediation === d.id ? null : d.id)}>Remediate</Button></TableCell>
                  </TableRow>
                  {showRemediation === d.id && (
                    <TableRow className="border-slate-200"><TableCell colSpan={6} className="bg-slate-50">
                      <div className="p-3 space-y-3">
                        <div className="text-sm font-medium text-slate-700">Remediation actions</div>
                        {remediations.filter(r => r.deficiency_id === d.id).map(r => (
                          <div key={r.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                            <div className="text-slate-700">{r.description}</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-slate-500">{r.target_date?.split('T')[0]}</span>
                              <Badge className={`rounded-full px-2 py-0.5 text-xs ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'}`}>{r.status}</Badge>
                              {r.status !== 'completed' && <Button variant="outline" className="rounded-lg text-xs px-2 py-0.5 border-slate-200 text-slate-400" onClick={() => completeRemediation(r.id)}>Complete</Button>}
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <FieldLabel label="Action" required />
                            <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="What needs to be done to fix this?" value={newRem.description} onChange={e => setNewRem({ ...newRem, description: e.target.value })} />
                          </div>
                          <div>
                            <FieldLabel label="Target date" />
                            <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 w-40" type="date" value={newRem.target_date} onChange={e => setNewRem({ ...newRem, target_date: e.target.value })} />
                          </div>
                          <Button className="rounded-xl mt-5" onClick={() => addRemediation(d.id)}>Add</Button>
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
