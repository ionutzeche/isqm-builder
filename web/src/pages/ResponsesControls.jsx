import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageGuidanceCard from '@/components/forms/PageGuidanceCard';
import FieldLabel from '@/components/forms/FieldLabel';
import HelperText from '@/components/forms/HelperText';
import ExampleCard from '@/components/forms/ExampleCard';
import ValidationBanner from '@/components/forms/ValidationBanner';
import api from '@/api';

export default function ResponsesControls() {
  const [responses, setResponses] = useState([]);
  const [controls, setControls] = useState([]);
  const [risks, setRisks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddControl, setShowAddControl] = useState(null);
  const [showLinkRisk, setShowLinkRisk] = useState(null); // response id
  const [showHelp, setShowHelp] = useState(false);
  const [newResp, setNewResp] = useState({ title: '', description: '', frequency: 'quarterly' });
  const [newCtrl, setNewCtrl] = useState({ title: '', description: '', control_type: 'manual', evidence_required: '' });
  const [tab, setTab] = useState('responses');
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [r, c, rk] = await Promise.all([
        api.get('/api/responses'), api.get('/api/responses/controls'), api.get('/api/risks')
      ]);
      setResponses(r.data); setControls(c.data); setRisks(rk.data || []);
    } catch (e) { console.error(e); }
  }

  async function addResponse() {
    if (!newResp.title) { setShowValidation(true); return; }
    try { await api.post('/api/responses', newResp); setNewResp({ title: '', description: '', frequency: 'quarterly' }); setShowAdd(false); setShowValidation(false); loadData(); } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function addControl(responseId) {
    if (!newCtrl.title) return;
    try { await api.post('/api/responses/controls', { ...newCtrl, response_id: responseId }); setNewCtrl({ title: '', description: '', control_type: 'manual', evidence_required: '' }); setShowAddControl(null); loadData(); } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function addFromTemplate(t) {
    try { const r = await api.post('/api/responses', { title: t.title, description: t.desc, frequency: t.freq }); loadData(); setTab('responses'); setShowLinkRisk(r.data?.id || null); } catch (e) { alert(e.message); }
  }

  async function linkRisk(responseId, riskId) {
    try { await api.post('/api/responses/link-risk', { response_id: responseId, risk_id: riskId }); setShowLinkRisk(null); loadData(); } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  const effColor = (s) => s === 'effective' ? 'bg-emerald-100 text-emerald-600' : s === 'ineffective' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-400';

  const templates = [
    { title: 'Independence confirmation process', desc: 'Annual declarations from all professional staff confirming compliance with independence requirements.', freq: 'annual' },
    { title: 'Engagement quality review trigger', desc: 'EQR required for PIE audits, listed entities, and engagements designated by Quality Partner.', freq: 'ad_hoc' },
    { title: 'Cold file review programme', desc: 'Selection and review of completed engagement files to assess compliance with methodology.', freq: 'quarterly' },
    { title: 'Client acceptance AML/KYC check', desc: 'Structured due diligence including beneficial ownership, PEP screening, and risk classification.', freq: 'ad_hoc' },
    { title: 'Consultation escalation protocol', desc: 'Mandatory consultation for complex accounting, going concern, fraud indicators, and regulatory matters.', freq: 'ad_hoc' },
    { title: 'Methodology update distribution', desc: 'Distribution of CLA Global and local methodology updates with mandatory acknowledgement.', freq: 'quarterly' },
    { title: 'CPD compliance tracking', desc: 'Monitoring of continuing professional development hours against minimum requirements.', freq: 'quarterly' },
    { title: 'File assembly deadline monitoring', desc: 'Tracking 60-day file assembly deadline with automated alerts for overdue engagements.', freq: 'monthly' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-slate-500 mb-2">Responses & Controls</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Link risks to operational responses</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">A response is a policy or procedure the firm uses to address a risk. A control is a specific activity within a response. Both must be operational, not aspirational.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-700" onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide guide' : 'How to complete this page'}</Button>
          <Button className="rounded-xl" onClick={() => { setTab('responses'); setShowAdd(true); }}>+ Add response</Button>
        </div>
      </div>

      {showHelp && (
        <PageGuidanceCard
          purpose="Define responses (policies/procedures) and controls (specific activities) that address quality risks."
          required="Response title, description of what it does operationally, frequency, and owner. Controls need evidence requirements."
          example="Cold file review programme — 3 completed engagement files reviewed per quarter against methodology compliance checklist."
          mistakes={['Writing "the firm will ensure quality" (too vague)', 'No frequency (when does this happen?)', 'No evidence requirement on controls (how do you prove it was done?)', 'Response not linked to any risk']}
        />
      )}

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="rounded-2xl h-auto p-1 bg-white">
          <TabsTrigger value="responses" className="rounded-xl">Responses ({responses.length})</TabsTrigger>
          <TabsTrigger value="controls" className="rounded-xl">Controls ({controls.length})</TabsTrigger>
          <TabsTrigger value="templates" className="rounded-xl">Templates (8)</TabsTrigger>
        </TabsList>

        <TabsContent value="responses">
          {showAdd && (
            <Card className="rounded-2xl border-slate-200 bg-white mb-4">
              <CardContent className="p-4 space-y-3">
                <ValidationBanner show={showValidation && !newResp.title} message="Response title is required." />
                <div>
                  <FieldLabel label="Response title" required />
                  <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="e.g. Cold file review programme — 3 files per quarter" value={newResp.title} onChange={e => setNewResp({ ...newResp, title: e.target.value })} />
                  <HelperText>What does this response do? Be specific and operational.</HelperText>
                </div>
                <div>
                  <FieldLabel label="Description" />
                  <Textarea className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-16" placeholder="Describe how this response works in practice..." value={newResp.description} onChange={e => setNewResp({ ...newResp, description: e.target.value })} />
                  <HelperText>How does this response operate? Who does what, when?</HelperText>
                </div>
                <div className="flex gap-3 items-end">
                  <div>
                    <FieldLabel label="Frequency" required />
                    <select className="mt-1 rounded-xl bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm" value={newResp.frequency} onChange={e => setNewResp({ ...newResp, frequency: e.target.value })}>
                      <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="ad_hoc">Ad hoc / per engagement</option>
                    </select>
                  </div>
                  <Button className="rounded-xl" onClick={addResponse}>Save response</Button>
                  <Button variant="outline" className="rounded-xl border-slate-200 text-slate-400" onClick={() => { setShowAdd(false); setShowValidation(false); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="rounded-2xl border-slate-200 bg-white overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-slate-200">
                  <TableHead className="text-slate-500">Response</TableHead><TableHead className="text-slate-500">Frequency</TableHead><TableHead className="text-slate-500">Linked risks</TableHead><TableHead className="text-slate-500">Effectiveness</TableHead><TableHead className="text-slate-500">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {responses.length === 0 && <TableRow className="border-slate-200"><TableCell colSpan={6} className="text-center py-8 text-slate-600">No responses yet. Add one or use the Templates tab to start from a standard pattern.</TableCell></TableRow>}
                  {responses.map(r => (
                    <React.Fragment key={r.id}>
                      <TableRow className="border-slate-200 hover:bg-slate-50">
                        <TableCell><div className="font-medium text-slate-900">{r.title}</div>{r.description && <div className="text-xs text-slate-600 mt-1 line-clamp-1">{r.description}</div>}</TableCell>
                        <TableCell><Badge variant="outline" className="rounded-full border-slate-200 text-slate-400">{r.frequency?.replace('_', ' ') || '—'}</Badge></TableCell>
                        <TableCell className="text-sm font-mono text-slate-400">{r.linked_risks || 0}</TableCell>
                        <TableCell><Badge className={`rounded-full px-3 py-1 ${effColor(r.effectiveness_status)}`}>{r.effectiveness_status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" className="rounded-xl text-xs border-slate-200 text-slate-400" onClick={() => setShowLinkRisk(showLinkRisk === r.id ? null : r.id)}>Link risk</Button>
                            <Button variant="outline" className="rounded-xl text-xs border-slate-200 text-slate-400" onClick={() => setShowAddControl(showAddControl === r.id ? null : r.id)}>+ Control</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {showLinkRisk === r.id && (
                        <TableRow className="border-slate-200"><TableCell colSpan={6} className="bg-blue-50">
                          <div className="p-3">
                            <div className="text-sm font-medium text-blue-700 mb-2">Link this response to a quality risk</div>
                            {risks.filter(rk => rk.status !== 'archived').length === 0 ? (
                              <div className="text-sm text-slate-500">No risks in the register yet. Add risks first.</div>
                            ) : (
                              <div className="grid gap-2 max-h-48 overflow-y-auto">
                                {risks.filter(rk => rk.status !== 'archived').map(rk => (
                                  <button key={rk.id} onClick={() => linkRisk(r.id, rk.id)} className="w-full text-left rounded-xl border border-blue-200 bg-white p-3 hover:bg-blue-50 transition text-sm">
                                    <div className="font-medium text-slate-900">{rk.title}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{rk.component_name} · Residual: {rk.residual_score || '—'}</div>
                                  </button>
                                ))}
                              </div>
                            )}
                            <Button variant="outline" className="rounded-xl text-xs mt-2" onClick={() => setShowLinkRisk(null)}>Cancel</Button>
                          </div>
                        </TableCell></TableRow>
                      )}
                      {showAddControl === r.id && (
                        <TableRow className="border-slate-200"><TableCell colSpan={6} className="bg-slate-50">
                          <div className="p-3 space-y-3">
                            <div className="text-sm font-medium text-slate-700">Add control to this response</div>
                            <div className="flex gap-3 items-end">
                              <div className="flex-1">
                                <FieldLabel label="Control title" required />
                                <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="e.g. Review checklist completed and signed" value={newCtrl.title} onChange={e => setNewCtrl({ ...newCtrl, title: e.target.value })} />
                              </div>
                              <div>
                                <FieldLabel label="Type" />
                                <select className="mt-1 rounded-xl bg-white border border-slate-200 text-slate-900 px-2 py-2 text-xs" value={newCtrl.control_type} onChange={e => setNewCtrl({ ...newCtrl, control_type: e.target.value })}>
                                  <option value="manual">Manual</option><option value="automated">Automated</option>
                                </select>
                              </div>
                              <div className="flex-1">
                                <FieldLabel label="Evidence required" />
                                <Input className="mt-1 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="e.g. Signed checklist, screenshot" value={newCtrl.evidence_required} onChange={e => setNewCtrl({ ...newCtrl, evidence_required: e.target.value })} />
                              </div>
                              <Button className="rounded-xl mt-5" onClick={() => addControl(r.id)}>Save</Button>
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
        </TabsContent>

        <TabsContent value="controls">
          <Card className="rounded-2xl border-slate-200 bg-white overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-slate-200"><TableHead className="text-slate-500">Control</TableHead><TableHead className="text-slate-500">Type</TableHead><TableHead className="text-slate-500">Evidence required</TableHead><TableHead className="text-slate-500">Reviewer</TableHead></TableRow></TableHeader>
                <TableBody>
                  {controls.length === 0 && <TableRow className="border-slate-200"><TableCell colSpan={4} className="text-center py-8 text-slate-600">No controls yet. Add controls from the Responses tab.</TableCell></TableRow>}
                  {controls.map(c => (
                    <TableRow key={c.id} className="border-slate-200 hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">{c.title}</TableCell>
                      <TableCell><Badge variant="outline" className="rounded-full border-slate-200 text-slate-400">{c.control_type}</Badge></TableCell>
                      <TableCell className="text-sm text-slate-500">{c.evidence_required || '—'}</TableCell>
                      <TableCell className="text-sm text-slate-400">{c.reviewer_name || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <PageGuidanceCard purpose="These are standard ISQM-1 response patterns. Click any template to add it as a response, then customise for CLA Romania." required="Review each template before adding. Customise the description to reflect how CLA Romania actually operates." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
            {templates.map(t => (
              <Card key={t.title} className="rounded-2xl border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer" onClick={() => addFromTemplate(t)}>
                <CardContent className="p-5">
                  <div className="font-medium text-slate-900">{t.title}</div>
                  <div className="text-sm text-slate-500 mt-2 leading-relaxed">{t.desc}</div>
                  <Badge variant="outline" className="rounded-full border-slate-200 text-slate-400 mt-3">{t.freq.replace('_', ' ')}</Badge>
                  <div className="text-xs text-slate-600 mt-2">Click to add as response</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
