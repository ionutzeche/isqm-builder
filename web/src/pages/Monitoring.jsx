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

export default function Monitoring() {
  const [activities, setActivities] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({ title: '', method: 'file_review', result: 'pass', notes: '' });
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => { loadActivities(); }, []);
  async function loadActivities() { try { const { data } = await api.get('/api/monitoring'); setActivities(data); } catch (e) { console.error(e); } }

  async function addActivity() {
    if (!form.title) { setShowValidation(true); return; }
    try { await api.post('/api/monitoring', { ...form, performed_at: new Date().toISOString().split('T')[0] }); setForm({ title: '', method: 'file_review', result: 'pass', notes: '' }); setShowAdd(false); setShowValidation(false); loadActivities(); } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const resultColor = (r) => r === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400';
  const methodLabel = { inspection: 'Inspection', walkthrough: 'Walkthrough', analytics: 'Analytics', thematic_review: 'Thematic review', file_review: 'File review' };
  const issues = activities.filter(a => a.result === 'issue_found').length;

  const formChecklist = [
    { label: 'Activity title', done: !!form.title },
    { label: 'Method selected', done: !!form.method },
    { label: 'Result recorded', done: !!form.result },
    { label: 'Notes added', done: !!form.notes },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-slate-500 mb-2">Monitoring</div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Track monitoring activities</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">Log activities that test whether the quality system is working. Each activity may generate findings or deficiencies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-slate-700 text-slate-300" onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide guide' : 'How to complete this page'}</Button>
          <Button className="rounded-xl" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Log activity'}</Button>
        </div>
      </div>

      {showHelp && (
        <PageGuidanceCard
          purpose="Log monitoring activities that test the quality system. Types: cold file review, walkthrough, inspection, analytics, thematic review."
          required="Activity title, method, and result (pass or issue found). Add notes describing what you observed."
          example="Cold file review Q1 2026 — Engagement A statutory audit. Reviewed planning memo, TB mapping, review notes clearance."
          mistakes={['Logging an activity without recording the outcome', 'Not distinguishing between "pass" and "issue found"', 'Vague notes that do not describe what was tested', 'Finding an issue but not creating a deficiency from it']}
        />
      )}

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="rounded-2xl border-slate-700 bg-slate-900/50"><CardContent className="p-4"><div className="text-sm text-slate-500">Activities logged</div><div className="text-2xl font-semibold mt-1 text-white">{activities.length}</div></CardContent></Card>
        <Card className="rounded-2xl border-slate-700 bg-slate-900/50"><CardContent className="p-4"><div className="text-sm text-slate-500">Issues found</div><div className="text-2xl font-semibold mt-1 text-rose-400">{issues}</div></CardContent></Card>
        <Card className="rounded-2xl border-slate-700 bg-slate-900/50"><CardContent className="p-4"><div className="text-sm text-slate-500">Pass rate</div><div className="text-2xl font-semibold mt-1 text-emerald-400">{activities.length ? Math.round((activities.length - issues) / activities.length * 100) + '%' : '—'}</div></CardContent></Card>
        <Card className="rounded-2xl border-slate-700 bg-slate-900/50"><CardContent className="p-4"><div className="text-sm text-slate-500">Methods used</div><div className="text-2xl font-semibold mt-1 text-white">{[...new Set(activities.map(a => a.method))].length}</div></CardContent></Card>
      </div>

      {showAdd && (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr] mb-6">
          <Card className="rounded-2xl border-slate-700 bg-slate-900/50">
            <CardHeader><CardTitle className="text-white text-sm uppercase tracking-wider">Log monitoring activity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ValidationBanner show={showValidation && !form.title} message="Activity title is required." />
              <div>
                <FieldLabel label="Activity title" required />
                <Input className="mt-1 rounded-xl bg-slate-800 border-slate-700 text-white placeholder:text-slate-600" placeholder="e.g. Cold file review Q1 2026 — Engagement A statutory audit" value={form.title} onChange={e => set('title', e.target.value)} />
                <HelperText>What monitoring activity was performed? Be specific about scope.</HelperText>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel label="Method" required />
                  <select className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2 text-sm" value={form.method} onChange={e => set('method', e.target.value)}>
                    <option value="file_review">File review</option><option value="inspection">Inspection</option><option value="walkthrough">Walkthrough</option><option value="analytics">Analytics</option><option value="thematic_review">Thematic review</option>
                  </select>
                  <HelperText>How was this activity performed?</HelperText>
                </div>
                <div>
                  <FieldLabel label="Result" required />
                  <select className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2 text-sm" value={form.result} onChange={e => set('result', e.target.value)}>
                    <option value="pass">Pass — no issues</option><option value="issue_found">Issue found</option>
                  </select>
                  <HelperText>Did you find any issues? If yes, create a deficiency after saving.</HelperText>
                </div>
              </div>
              <div>
                <FieldLabel label="Notes and observations" />
                <Textarea className="mt-1 rounded-xl bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 min-h-24" placeholder="What was tested? What was observed? Any recommendations?" value={form.notes} onChange={e => set('notes', e.target.value)} />
                <HelperText>Describe what you reviewed, what you found, and any follow-up needed.</HelperText>
              </div>
              <StickyActionBar status={`${formChecklist.filter(c => c.done).length} of ${formChecklist.length} fields complete`}>
                <Button className="rounded-xl" onClick={addActivity}>Save activity</Button>
              </StickyActionBar>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <CompletionChecklist items={formChecklist} />
            <ExampleCard title="Good monitoring entry" fields={[
              { label: 'Title', value: 'Cold file review Q1 2026 — Engagement A statutory audit' },
              { label: 'Method', value: 'File review' },
              { label: 'Result', value: 'Issue found — 2 review notes not cleared before sign-off' },
              { label: 'Notes', value: 'Reviewed planning memo (OK), TB mapping (3 exceptions), review notes (2 uncleared). Recommend re-briefing team on clearance process.' },
            ]} />
          </div>
        </div>
      )}

      <Card className="rounded-2xl border-slate-700 bg-slate-900/50 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="border-slate-800">
              <TableHead className="text-slate-500">Activity</TableHead><TableHead className="text-slate-500">Method</TableHead><TableHead className="text-slate-500">Date</TableHead><TableHead className="text-slate-500">Result</TableHead><TableHead className="text-slate-500">Notes</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {activities.length === 0 && <TableRow className="border-slate-800"><TableCell colSpan={5} className="text-center py-8 text-slate-600">No monitoring activities logged yet. Click "Log activity" to record a review or inspection.</TableCell></TableRow>}
              {activities.map(a => (
                <TableRow key={a.id} className="border-slate-800 hover:bg-slate-800/30">
                  <TableCell className="font-medium text-slate-200">{a.title}</TableCell>
                  <TableCell><Badge variant="outline" className="rounded-full border-slate-700 text-slate-400">{methodLabel[a.method] || a.method}</Badge></TableCell>
                  <TableCell className="text-sm font-mono text-slate-400">{a.performed_at?.split('T')[0] || '—'}</TableCell>
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
