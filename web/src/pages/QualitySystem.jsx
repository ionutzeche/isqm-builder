import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import api from '@/api';

export default function QualitySystem() {
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newObj, setNewObj] = useState({ title: '', description: '' });

  useEffect(() => { loadComponents(); }, []);
  useEffect(() => { if (selected) loadObjectives(selected.id); }, [selected]);

  async function loadComponents() {
    try {
      const { data } = await api.get('/api/components');
      setComponents(data);
      if (data.length && !selected) setSelected(data[0]);
    } catch (e) { console.error(e); }
  }

  async function loadObjectives(componentId) {
    try {
      const { data } = await api.get(`/api/objectives?component_id=${componentId}`);
      setObjectives(data);
    } catch (e) { setObjectives([]); }
  }

  async function addObjective() {
    if (!newObj.title || !selected) return;
    try {
      await api.post('/api/objectives', { component_id: selected.id, title: newObj.title, description: newObj.description, status: 'draft' });
      setNewObj({ title: '', description: '' });
      setShowAdd(false);
      loadObjectives(selected.id);
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/api/objectives/${id}`, { status });
      loadObjectives(selected.id);
    } catch (e) { console.error(e); }
  }

  const statusColor = (s) => s === 'implemented' ? 'bg-emerald-100 text-emerald-700' : s === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600';
  const implemented = objectives.filter(o => o.status === 'implemented').length;
  const pct = objectives.length ? Math.round(implemented / objectives.length * 100) : 0;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500 mb-2">Quality System Designer</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Build your ISQM-1 system by component</h1>
          <p className="text-slate-600 mt-2 max-w-3xl">Define quality objectives for each ISQM-1 component. Each objective should have responses and linked risks.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr_300px]">
        {/* Component list */}
        <div className="space-y-2">
          {components.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full rounded-2xl border p-4 text-left transition ${selected?.id === c.id ? 'border-slate-900 bg-slate-50 shadow-sm' : 'hover:bg-slate-50'}`}>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">C{c.order_index}</div>
              <div className="font-medium text-slate-900 mt-1">{c.name}</div>
              <div className="text-xs text-slate-500 mt-2">{c.description?.substring(0, 60)}...</div>
            </button>
          ))}
        </div>

        {/* Objectives */}
        <Card className="rounded-3xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selected?.name || 'Select a component'}</CardTitle>
                <CardDescription>{objectives.length} objectives · {implemented} implemented · {pct}% complete</CardDescription>
              </div>
              <Button className="rounded-2xl" onClick={() => setShowAdd(!showAdd)}>Add objective</Button>
            </div>
            <Progress value={pct} className="h-2 mt-3" />
          </CardHeader>
          <CardContent className="p-0">
            {showAdd && (
              <div className="p-4 border-b bg-slate-50 space-y-3">
                <Input className="rounded-2xl" placeholder="Objective title" value={newObj.title} onChange={e => setNewObj({ ...newObj, title: e.target.value })} />
                <Textarea className="rounded-2xl" placeholder="Description" value={newObj.description} onChange={e => setNewObj({ ...newObj, description: e.target.value })} />
                <div className="flex gap-2">
                  <Button className="rounded-2xl" onClick={addObjective}>Save</Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </div>
            )}
            {objectives.length === 0 && !showAdd && (
              <div className="p-8 text-center text-slate-500">No objectives yet. Click "Add objective" to start building this component.</div>
            )}
            {objectives.map(obj => (
              <div key={obj.id} className="p-4 border-b last:border-b-0 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{obj.title}</div>
                    {obj.description && <div className="text-sm text-slate-500 mt-1 line-clamp-2">{obj.description}</div>}
                    {obj.owner_name && <div className="text-xs text-slate-400 mt-1">Owner: {obj.owner_name}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`rounded-full px-3 py-1 ${statusColor(obj.status)}`}>{obj.status}</Badge>
                    <select className="text-xs border rounded-lg px-2 py-1" value={obj.status} onChange={e => updateStatus(obj.id, e.target.value)}>
                      <option value="draft">Draft</option>
                      <option value="in_progress">In progress</option>
                      <option value="implemented">Implemented</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Context panel */}
        <div className="space-y-4">
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="text-sm">Component summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Objectives</span><span className="font-medium">{objectives.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Implemented</span><span className="font-medium text-emerald-600">{implemented}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">In progress</span><span className="font-medium text-amber-600">{objectives.filter(o => o.status === 'in_progress').length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Draft</span><span className="font-medium">{objectives.filter(o => o.status === 'draft').length}</span></div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="text-sm">ISQM-1 reference</CardTitle></CardHeader>
            <CardContent className="text-xs text-slate-500 leading-relaxed">
              {selected?.description || 'Select a component to see its ISQM-1 reference description.'}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
