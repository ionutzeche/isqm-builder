import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/api';

export default function ResponsesControls() {
  const [responses, setResponses] = useState([]);
  const [controls, setControls] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddControl, setShowAddControl] = useState(null);
  const [newResp, setNewResp] = useState({ title: '', description: '', frequency: 'quarterly' });
  const [newCtrl, setNewCtrl] = useState({ title: '', description: '', control_type: 'manual', evidence_required: '' });
  const [tab, setTab] = useState('responses');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [r, c] = await Promise.all([api.get('/api/responses'), api.get('/api/responses/controls')]);
      setResponses(r.data);
      setControls(c.data);
    } catch (e) { console.error(e); }
  }

  async function addResponse() {
    if (!newResp.title) return;
    try {
      await api.post('/api/responses', newResp);
      setNewResp({ title: '', description: '', frequency: 'quarterly' });
      setShowAdd(false);
      loadData();
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function addControl(responseId) {
    if (!newCtrl.title) return;
    try {
      await api.post('/api/responses/controls', { ...newCtrl, response_id: responseId });
      setNewCtrl({ title: '', description: '', control_type: 'manual', evidence_required: '' });
      setShowAddControl(null);
      loadData();
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  const effColor = (s) => s === 'effective' ? 'bg-emerald-100 text-emerald-700' : s === 'ineffective' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600';

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500 mb-2">Responses & Controls</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Link risks to operational responses</h1>
          <p className="text-slate-600 mt-2 max-w-3xl">Define responses, attach controls, assign owners, and track effectiveness. Every response must be operational, not aspirational.</p>
        </div>
        <Button className="rounded-2xl" onClick={() => { setTab('responses'); setShowAdd(true); }}>Add response</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="rounded-2xl h-auto p-1">
          <TabsTrigger value="responses" className="rounded-xl">Responses ({responses.length})</TabsTrigger>
          <TabsTrigger value="controls" className="rounded-xl">Controls ({controls.length})</TabsTrigger>
          <TabsTrigger value="templates" className="rounded-xl">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="responses">
          {showAdd && (
            <Card className="rounded-3xl mb-4">
              <CardContent className="p-4 space-y-3">
                <Input className="rounded-2xl" placeholder="Response title" value={newResp.title} onChange={e => setNewResp({ ...newResp, title: e.target.value })} />
                <Textarea className="rounded-2xl" placeholder="Description — what this response does operationally" value={newResp.description} onChange={e => setNewResp({ ...newResp, description: e.target.value })} />
                <div className="flex gap-3 items-center">
                  <select className="border rounded-xl px-3 py-2 text-sm" value={newResp.frequency} onChange={e => setNewResp({ ...newResp, frequency: e.target.value })}>
                    <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="ad_hoc">Ad hoc</option>
                  </select>
                  <Button className="rounded-2xl" onClick={addResponse}>Save response</Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Response</TableHead><TableHead>Frequency</TableHead><TableHead>Owner</TableHead><TableHead>Linked risks</TableHead><TableHead>Effectiveness</TableHead><TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {responses.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No responses yet. Add one to start linking risks to operational controls.</TableCell></TableRow>}
                  {responses.map(r => (
                    <React.Fragment key={r.id}>
                      <TableRow>
                        <TableCell><div className="font-medium">{r.title}</div>{r.description && <div className="text-xs text-slate-500 mt-1 line-clamp-1">{r.description}</div>}</TableCell>
                        <TableCell><Badge variant="outline" className="rounded-full">{r.frequency || '—'}</Badge></TableCell>
                        <TableCell className="text-sm">{r.owner_name || '—'}</TableCell>
                        <TableCell className="text-sm font-mono">{r.linked_risks || 0}</TableCell>
                        <TableCell><Badge className={`rounded-full px-3 py-1 ${effColor(r.effectiveness_status)}`}>{r.effectiveness_status}</Badge></TableCell>
                        <TableCell><Button variant="outline" className="rounded-xl text-xs" onClick={() => setShowAddControl(showAddControl === r.id ? null : r.id)}>Add control</Button></TableCell>
                      </TableRow>
                      {showAddControl === r.id && (
                        <TableRow><TableCell colSpan={6} className="bg-slate-50">
                          <div className="flex gap-3 items-end p-2">
                            <div className="flex-1 space-y-2">
                              <Input className="rounded-xl" placeholder="Control title" value={newCtrl.title} onChange={e => setNewCtrl({ ...newCtrl, title: e.target.value })} />
                              <div className="flex gap-2">
                                <select className="border rounded-xl px-2 py-1 text-xs" value={newCtrl.control_type} onChange={e => setNewCtrl({ ...newCtrl, control_type: e.target.value })}>
                                  <option value="manual">Manual</option><option value="automated">Automated</option>
                                </select>
                                <Input className="rounded-xl text-xs" placeholder="Evidence required" value={newCtrl.evidence_required} onChange={e => setNewCtrl({ ...newCtrl, evidence_required: e.target.value })} />
                              </div>
                            </div>
                            <Button className="rounded-xl" onClick={() => addControl(r.id)}>Save</Button>
                          </div>
                        </TableCell></TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls">
          <Card className="rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Control</TableHead><TableHead>Type</TableHead><TableHead>Evidence required</TableHead><TableHead>Reviewer</TableHead></TableRow></TableHeader>
                <TableBody>
                  {controls.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-500">No controls yet. Add controls from the Responses tab.</TableCell></TableRow>}
                  {controls.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell><Badge variant="outline" className="rounded-full">{c.control_type}</Badge></TableCell>
                      <TableCell className="text-sm text-slate-600">{c.evidence_required || '—'}</TableCell>
                      <TableCell className="text-sm">{c.reviewer_name || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { title: 'Independence confirmation process', desc: 'Annual declarations from all professional staff confirming compliance with independence requirements.', freq: 'Annual' },
              { title: 'Engagement quality review trigger', desc: 'EQR required for PIE audits, listed entities, and engagements designated by Quality Partner.', freq: 'Per engagement' },
              { title: 'Cold file review programme', desc: 'Selection and review of completed engagement files to assess compliance with methodology.', freq: 'Quarterly' },
              { title: 'Client acceptance AML/KYC check', desc: 'Structured due diligence including beneficial ownership, PEP screening, and risk classification.', freq: 'Per client' },
              { title: 'Consultation escalation protocol', desc: 'Mandatory consultation for complex accounting, going concern, fraud indicators, and regulatory matters.', freq: 'Ad hoc' },
              { title: 'Methodology update distribution', desc: 'Distribution of CLA Global and local methodology updates with mandatory acknowledgement.', freq: 'Quarterly' },
              { title: 'CPD compliance tracking', desc: 'Monitoring of continuing professional development hours against minimum requirements.', freq: 'Semi-annual' },
              { title: 'File assembly deadline monitoring', desc: 'Tracking 60-day file assembly deadline with automated alerts for overdue engagements.', freq: 'Monthly' },
            ].map(t => (
              <Card key={t.title} className="rounded-3xl hover:shadow-md transition cursor-pointer" onClick={async () => {
                try { await api.post('/api/responses', { title: t.title, description: t.desc, frequency: t.freq.toLowerCase().replace(/ /g, '_') }); loadData(); setTab('responses'); } catch (e) { alert(e.message); }
              }}>
                <CardContent className="p-5">
                  <div className="font-medium text-slate-900">{t.title}</div>
                  <div className="text-sm text-slate-500 mt-2 leading-relaxed">{t.desc}</div>
                  <Badge variant="outline" className="rounded-full mt-3">{t.freq}</Badge>
                  <div className="text-xs text-slate-400 mt-2">Click to add as response</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
