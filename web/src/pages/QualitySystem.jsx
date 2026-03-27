import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import PageGuidanceCard from '@/components/forms/PageGuidanceCard';
import FieldLabel from '@/components/forms/FieldLabel';
import HelperText from '@/components/forms/HelperText';
import CompletionChecklist from '@/components/forms/CompletionChecklist';
import ExampleCard from '@/components/forms/ExampleCard';
import ValidationBanner from '@/components/forms/ValidationBanner';
import api from '@/api';

export default function QualitySystem() {
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newObj, setNewObj] = useState({ title: '', description: '', status: 'draft' });
  const [showHelp, setShowHelp] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => { loadComponents(); }, []);
  useEffect(() => { if (selected) loadObjectives(selected.id); }, [selected]);

  async function loadComponents() {
    try { const { data } = await api.get('/api/components'); setComponents(data); if (data.length && !selected) setSelected(data[0]); } catch (e) { console.error(e); }
  }
  async function loadObjectives(componentId) {
    try { const { data } = await api.get(`/api/objectives?component_id=${componentId}`); setObjectives(data); } catch (e) { setObjectives([]); }
  }
  async function addObjective() {
    if (!newObj.title) { setShowValidation(true); return; }
    try { await api.post('/api/objectives', { component_id: selected.id, title: newObj.title, description: newObj.description, status: newObj.status }); setNewObj({ title: '', description: '', status: 'draft' }); setShowAdd(false); setShowValidation(false); loadObjectives(selected.id); } catch (e) { alert(e.response?.data?.error || e.message); }
  }
  async function updateStatus(id, status) {
    try { await api.put(`/api/objectives/${id}`, { status }); loadObjectives(selected.id); } catch (e) { console.error(e); }
  }
  async function deleteObj(id) {
    if (!confirm('Delete this objective?')) return;
    try { await api.delete(`/api/objectives/${id}`); loadObjectives(selected.id); } catch (e) { console.error(e); }
  }

  const statusColor = (s) => s === 'implemented' ? 'bg-emerald-100 text-emerald-600' : s === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-400';
  const implemented = objectives.filter(o => o.status === 'implemented').length;
  const pct = objectives.length ? Math.round(implemented / objectives.length * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-slate-500 mb-2">Quality System Designer</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Build your ISQM-1 system</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">Define quality objectives for each of the 8 ISQM-1 components. Each objective describes what the firm must achieve.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-slate-200 text-slate-700" onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide guide' : 'How to complete this page'}</Button>
      </div>

      {showHelp && (
        <PageGuidanceCard
          purpose="Define quality objectives the firm must achieve for each ISQM-1 component. Objectives are the foundation — risks and responses link to them."
          required="At least 2-4 objectives per component. Each needs a clear title and status."
          example="Personnel fulfil responsibilities for ethical requirements including independence."
          mistakes={['Writing a risk instead of an objective', 'Too vague (e.g. "ensure quality")', 'No status set', 'Duplicating objectives across components']}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[260px_1fr_280px]">
        {/* Component list */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">8 ISQM-1 components</div>
          {components.map(c => (
            <button key={c.id} onClick={() => { setSelected(c); setShowAdd(false); }}
              className={`w-full rounded-2xl border p-3 text-left transition ${selected?.id === c.id ? 'border-amber-500/50 bg-white shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">C{c.order_index}</div>
              <div className="font-medium text-slate-900 mt-1 text-sm leading-snug">{c.name}</div>
            </button>
          ))}
        </div>

        {/* Objectives */}
        <Card className="rounded-2xl border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900">{selected?.name || 'Select a component'}</CardTitle>
                <CardDescription className="text-slate-500">{objectives.length} objective{objectives.length !== 1 ? 's' : ''} · {implemented} implemented · {pct}% complete</CardDescription>
              </div>
              <Button className="rounded-xl" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add objective'}</Button>
            </div>
            <Progress value={pct} className="h-1.5 mt-3" />
          </CardHeader>
          <CardContent className="p-0">
            {showAdd && (
              <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
                <ValidationBanner show={showValidation && !newObj.title} message="Objective title is required." />
                <div>
                  <FieldLabel label="Objective title" required />
                  <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="e.g. Personnel fulfil responsibilities for ethical requirements including independence" value={newObj.title} onChange={e => setNewObj({ ...newObj, title: e.target.value })} />
                  <HelperText>What must the firm achieve? Write one clear sentence.</HelperText>
                </div>
                <div>
                  <FieldLabel label="Description" />
                  <Textarea className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-16" placeholder="Additional context about what this objective means for CLA Romania..." value={newObj.description} onChange={e => setNewObj({ ...newObj, description: e.target.value })} />
                  <HelperText>Optional. Explain scope and what "achieved" looks like.</HelperText>
                </div>
                <div className="flex gap-3 items-center">
                  <div>
                    <FieldLabel label="Status" />
                    <select className="mt-1 rounded-xl bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm" value={newObj.status} onChange={e => setNewObj({ ...newObj, status: e.target.value })}>
                      <option value="draft">Draft</option><option value="in_progress">In progress</option><option value="implemented">Implemented</option>
                    </select>
                  </div>
                  <Button className="rounded-xl mt-5" onClick={addObjective}>Save objective</Button>
                </div>
              </div>
            )}
            {objectives.length === 0 && !showAdd && (
              <div className="p-8 text-center">
                <div className="text-slate-600 mb-2">No objectives yet for this component.</div>
                <div className="text-sm text-slate-500">Click "+ Add objective" to start. Aim for 2-4 per component.</div>
              </div>
            )}
            {objectives.map(obj => (
              <div key={obj.id} className="p-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{obj.title}</div>
                    {obj.description && <div className="text-sm text-slate-500 mt-1 line-clamp-2">{obj.description}</div>}
                    {obj.owner_name && <div className="text-xs text-slate-600 mt-1">Owner: {obj.owner_name}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700" value={obj.status} onChange={e => updateStatus(obj.id, e.target.value)}>
                      <option value="draft">Draft</option><option value="in_progress">In progress</option><option value="implemented">Implemented</option>
                    </select>
                    <button className="text-slate-700 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs" onClick={() => deleteObj(obj.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right panel */}
        <div className="space-y-4">
          <CompletionChecklist items={[
            { label: 'Component selected', done: !!selected },
            { label: 'At least 1 objective', done: objectives.length > 0 },
            { label: 'At least 2 objectives', done: objectives.length >= 2 },
            { label: 'All have status set', done: objectives.length > 0 && objectives.every(o => o.status !== 'draft') },
            { label: '50%+ implemented', done: pct >= 50 },
          ]} />
          <ExampleCard title="Good objectives" fields={[
            { label: 'Governance', value: 'The firm demonstrates commitment to quality through a culture that recognises quality as essential.' },
            { label: 'Ethics', value: 'Personnel fulfil responsibilities for ethical requirements including independence.' },
            { label: 'Resources', value: 'Human resources with competence and capabilities are obtained, developed, and retained.' },
          ]} />
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">ISQM-1 reference</div>
            <div className="text-xs text-slate-500 leading-relaxed">{selected?.description || 'Select a component to see its description.'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
