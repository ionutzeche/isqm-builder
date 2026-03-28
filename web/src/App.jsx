import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Search, Bell, Building2, ShieldCheck, AlertTriangle, FileText, ClipboardList, LayoutDashboard, Settings, ChevronRight, CheckCircle2, Clock3, Users, FolderKanban, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/api';
import QualitySystemPage from '@/pages/QualitySystem';
import ResponsesControlsPage from '@/pages/ResponsesControls';
import MonitoringPage from '@/pages/Monitoring';
import DeficienciesPage from '@/pages/Deficiencies';
import AdminPage from '@/pages/Admin';
import LoginPage from '@/pages/Login';
import ImportPage from '@/pages/Import';
import RiskEntryPage from '@/pages/RiskEntry';
import HelpPage from '@/pages/Help';

const NAV_GROUPS = [
  { label: 'Overview', items: ['Dashboard'] },
  { label: 'Setup', items: ['Firm Setup', 'Quality System'] },
  { label: 'Risk & Response', items: ['Risk Register', 'Add Risk', 'Responses & Controls'] },
  { label: 'Operations', items: ['Monitoring', 'Deficiencies'] },
  { label: 'Reporting', items: ['Annual Assessment', 'Documents'] },
  { label: 'System', items: ['Import', 'Help', 'Admin'] },
];
const NAV_ICONS = { Dashboard: LayoutDashboard, 'Firm Setup': Building2, 'Quality System': FolderKanban, 'Risk Register': AlertTriangle, 'Add Risk': AlertTriangle, 'Responses & Controls': ShieldCheck, Monitoring: ClipboardList, Deficiencies: AlertTriangle, 'Annual Assessment': CheckCircle2, Documents: FileText, Import: FileText, Help: FileText, Admin: Settings };


function cn(...classes) { return classes.filter(Boolean).join(' '); }

function StatusBadge({ value }) {
  const map = { Draft: 'bg-slate-100 text-slate-700', 'In Review': 'bg-amber-100 text-amber-700', Approved: 'bg-emerald-100 text-emerald-700', Active: 'bg-rose-100 text-rose-700', Mitigated: 'bg-blue-100 text-blue-700', 'Not started': 'bg-slate-100 text-slate-500', active: 'bg-rose-100 text-rose-700', mitigated: 'bg-blue-100 text-blue-700', archived: 'bg-slate-100 text-slate-400' };
  return <Badge className={cn('rounded-full px-3 py-1', map[value] || 'bg-slate-100 text-slate-700')}>{value}</Badge>;
}

function SeverityBadge({ score }) {
  const s = parseInt(score) || 0;
  const label = s >= 12 ? 'High' : s >= 8 ? 'Medium' : 'Low';
  const cls = s >= 12 ? 'bg-rose-100 text-rose-700' : s >= 8 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
  return <Badge className={cn('rounded-full px-3 py-1', cls)}>{label}</Badge>;
}

function Spinner() { return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>; }
function Section({ title, body }) { return <div className="rounded-2xl border p-4"><div className="text-sm text-slate-500 mb-2">{title}</div><div className="text-sm text-slate-700 leading-6 whitespace-pre-line">{body}</div></div>; }
function MetaRow({ label, value }) { return <div className="space-y-1"><div className="text-slate-500">{label}</div><div className="text-slate-900 font-medium">{value}</div></div>; }

function Sidebar({ page, setPage, onLogout, readiness }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-slate-200 bg-white">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img src="https://www.claglobal.com/media/z5ymuotz/cla-global-logo-0902.png" alt="CLA" className="h-5" />
          <div className="h-4 w-px bg-slate-200" />
          <div className="text-sm font-semibold text-slate-900">ISQM-1 Builder</div>
        </div>
      </div>
      <ScrollArea className="flex-1 py-2">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="px-3 mb-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">{group.label}</div>
            {group.items.map(item => {
              const Icon = NAV_ICONS[item] || FileText;
              const active = item === page;
              return (
                <button key={item} onClick={() => setPage(item)}
                  className={cn('w-full rounded-xl px-3 py-2 text-left text-[13px] transition flex items-center gap-2.5',
                    active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50')}>
                  <Icon className={cn('h-3.5 w-3.5 flex-shrink-0', active ? 'text-white' : 'text-slate-400')} />
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>
        ))}
      </ScrollArea>
      <div className="p-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Readiness</span>
            <span className="text-xs font-semibold text-slate-700">{readiness}%</span>
          </div>
          <Progress value={readiness} className="h-1.5" />
          <div className="text-[10px] text-slate-400 mt-1.5">CAFR evaluation: Dec 2026</div>
        </div>
        {onLogout && <button onClick={onLogout} className="w-full text-left text-xs text-slate-400 hover:text-slate-600 transition px-3 py-1.5">Sign out</button>}
      </div>
    </aside>
  );
}

function TopBar({ user }) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-6 h-14">
        <div className="flex items-center gap-3">
          <StatusBadge value="Draft" />
          <span className="text-xs text-slate-400 hidden sm:inline">SoQM Version 1.0 — March 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pl-2 border-l border-slate-100 ml-1">
            <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <span className="text-xs text-slate-600 hidden sm:inline">{user?.name || 'User'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
      <div><div className="text-sm text-slate-500 mb-2">{eyebrow}</div><h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1><p className="text-slate-600 mt-2 max-w-3xl">{subtitle}</p></div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

function KpiCard({ title, value, subtext, icon: Icon, loading }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-3xl border-slate-200 shadow-sm"><CardContent className="p-6"><div className="flex items-start justify-between"><div><div className="text-sm text-slate-500">{title}</div><div className="text-3xl font-semibold mt-2 text-slate-900">{loading ? '—' : value}</div><div className="text-sm text-slate-500 mt-2">{subtext}</div></div><div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center"><Icon className="h-5 w-5 text-slate-700" /></div></div></CardContent></Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD — live API data
// ══════════════════════════════════════════════════��════════════
function DashboardPage({ setPage }) {
  const [risks, setRisks] = useState([]);
  const [deficiencies, setDeficiencies] = useState([]);
  const [responses, setResponses] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/risks').then(r => r.data).catch(() => []),
      api.get('/api/monitoring/deficiencies').then(r => r.data).catch(() => []),
      api.get('/api/responses').then(r => r.data).catch(() => []),
      api.get('/api/objectives').then(r => r.data).catch(() => []),
    ]).then(([r, d, resp, obj]) => {
      setRisks(r); setDeficiencies(d); setResponses(resp); setObjectives(obj);
      setLoading(false);
    });
  }, []);

  const activeRisks = risks.filter(r => r.status !== 'archived');
  const highRisks = activeRisks.filter(r => (r.residual_score || 0) >= 12);
  const openDef = deficiencies.filter(d => d.status !== 'closed');
  const implemented = objectives.filter(o => o.status === 'implemented').length;
  const totalObj = objectives.length || 1;
  const readiness = Math.round((implemented / totalObj) * 100);
  const controlsForReview = responses.filter(r => !r.last_review_date || new Date(r.last_review_date) < new Date(Date.now() - 30*86400000)).length;

  // Group risks by component
  const riskByComponent = {};
  activeRisks.forEach(r => {
    const comp = r.component_name || 'Unknown';
    if (!riskByComponent[comp]) riskByComponent[comp] = { count: 0, totalResidual: 0, owner: r.owner_name || '—' };
    riskByComponent[comp].count++;
    riskByComponent[comp].totalResidual += (r.residual_score || 0);
  });
  const maxResidual = Math.max(1, ...Object.values(riskByComponent).map(v => v.totalResidual));

  return (
    <div>
      <PageHeader eyebrow="Dashboard — CLA Romania Audit" title="Run your quality system with clarity"
        subtitle={`ISQM-1 compliance tracker. ${activeRisks.length} quality risks, ${objectives.length} objectives, ${responses.length} responses. First annual evaluation: December 2026.`}
        actions={[<Button key="1" className="rounded-2xl" onClick={() => setPage('Annual Assessment')}>Start annual assessment</Button>, <Button key="2" variant="outline" className="rounded-2xl" onClick={() => setPage('Documents')}>Generate board summary</Button>]} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Open Quality Risks" value={String(activeRisks.length)} subtext={`${highRisks.length} high residual`} icon={AlertTriangle} loading={loading} />
        <KpiCard title="Open Deficiencies" value={String(openDef.length)} subtext={openDef.length ? 'Requires remediation' : 'All clear'} icon={ClipboardList} loading={loading} />
        <KpiCard title="Assessment Readiness" value={`${readiness}%`} subtext="First evaluation: Dec 2026" icon={CheckCircle2} loading={loading} />
        <KpiCard title="Controls for Review" value={String(controlsForReview)} subtext="Next 30 days" icon={Clock3} loading={loading} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3 mt-6">
        <Card className="rounded-3xl xl:col-span-2"><CardHeader><CardTitle>Risk by component</CardTitle><CardDescription>Residual risk concentration across ISQM-1 components.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {loading ? <Spinner /> : Object.entries(riskByComponent).sort((a,b) => b[1].totalResidual - a[1].totalResidual).map(([comp, data]) => (
              <div key={comp} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="text-slate-700">{comp}</span><span className="text-slate-500">{data.owner} · {data.count} risks</span></div><Progress value={Math.round((data.totalResidual / maxResidual) * 100)} className="h-2" /></div>
            ))}
            {!loading && Object.keys(riskByComponent).length === 0 && <div className="text-sm text-slate-400 text-center py-8">No risks registered yet. Go to Risk Register to add risks.</div>}
          </CardContent>
        </Card>
        <Card className="rounded-3xl"><CardHeader><CardTitle>Priority actions</CardTitle><CardDescription>Items requiring immediate attention.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {loading ? <Spinner /> : <>
              {openDef.filter(d => d.severity === 'high').map(d => <div key={d.id} className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Resolve: {d.title}</div>)}
              {highRisks.slice(0, 3).map(r => <div key={r.id} className="rounded-2xl border p-4 text-sm text-slate-700">Review high risk: {r.title}</div>)}
              {controlsForReview > 0 && <div className="rounded-2xl border p-4 text-sm text-slate-700">{controlsForReview} controls due for review in next 30 days</div>}
              {readiness < 100 && <div className="rounded-2xl border p-4 text-sm text-slate-700">Implement remaining {totalObj - implemented} quality objectives</div>}
            </>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RISK REGISTER — live API data
// ═══════════════════════════════════════════════════════════════
function RiskRegisterPage({ setPage }) {
  const [risks, setRisks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRisks = useCallback(() => {
    setLoading(true);
    api.get('/api/risks').then(r => {
      const data = r.data || [];
      setRisks(data);
      if (data.length && !selectedRisk) setSelectedRisk(data[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { loadRisks(); }, [loadRisks]);

  const filtered = useMemo(() => risks.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.title, r.component_name, r.practice_name, r.owner_name, r.description].join(' ').toLowerCase().includes(q);
  }), [search, risks]);

  const activeRisks = filtered.filter(r => r.status !== 'archived');

  return (
    <div>
      <PageHeader eyebrow="Risk Register — CLA Romania" title="Review, score, and manage quality risks"
        subtitle={`${risks.length} quality risks across ISQM-1 components. Every risk must have a clear owner, score, response, and next review date.`}
        actions={[<Button key="1" className="rounded-2xl" onClick={() => setPage('Add Risk')}>Add risk</Button>, <Button key="2" variant="outline" className="rounded-2xl">Export</Button>]} />
      {loading ? <Spinner /> : (
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
          <Card className="rounded-3xl overflow-hidden">
            <CardHeader className="border-b"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><CardTitle>Quality risks ({activeRisks.length})</CardTitle><CardDescription>Sorted by residual score. Click a row for details.</CardDescription></div><Input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-2xl w-72" placeholder="Search risks..." /></div></CardHeader>
            <CardContent className="p-0">
              {activeRisks.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <div className="font-medium">No risks found</div>
                  <div className="text-sm mt-1">{search ? 'Try a different search' : 'Add your first quality risk'}</div>
                </div>
              ) : (
                <Table><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Risk</TableHead><TableHead>Component</TableHead><TableHead>Residual</TableHead><TableHead>Owner</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>{activeRisks.map(risk => (
                    <TableRow key={risk.id} className={cn('cursor-pointer', selectedRisk?.id === risk.id && 'bg-slate-50')} onClick={() => setSelectedRisk(risk)}>
                      <TableCell className="font-mono text-xs">QR-{risk.id}</TableCell>
                      <TableCell className="font-medium max-w-[280px] truncate">{risk.title}</TableCell>
                      <TableCell className="text-sm">{risk.component_name}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><span>{risk.residual_score || '—'}</span><SeverityBadge score={risk.residual_score} /></div></TableCell>
                      <TableCell className="text-sm">{risk.owner_name || '—'}</TableCell>
                      <TableCell><StatusBadge value={risk.status} /></TableCell>
                    </TableRow>
                  ))}</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          {selectedRisk ? (
            <Card className="rounded-3xl"><CardHeader><CardTitle>QR-{selectedRisk.id} — Detail</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div><div className="flex items-center gap-2 flex-wrap mb-2"><StatusBadge value={selectedRisk.status} /><Badge variant="outline" className="rounded-full">{selectedRisk.component_name}</Badge>{selectedRisk.practice_name && <Badge variant="outline" className="rounded-full">{selectedRisk.practice_name}</Badge>}</div><h3 className="text-xl font-semibold text-slate-900">{selectedRisk.title}</h3></div>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-sm text-slate-500">Inherent</div><div className="text-2xl font-semibold mt-1">{selectedRisk.inherent_score || '—'}</div></CardContent></Card>
                  <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-sm text-slate-500">Residual</div><div className="text-2xl font-semibold mt-1">{selectedRisk.residual_score || '—'}</div></CardContent></Card>
                </div>
                {selectedRisk.description && <Section title="Description" body={selectedRisk.description} />}
                {selectedRisk.root_cause && <Section title="Root cause" body={selectedRisk.root_cause} />}
                <Section title="Owner" body={`${selectedRisk.owner_name || '—'} · Next review ${selectedRisk.next_review_date ? new Date(selectedRisk.next_review_date).toLocaleDateString('en-GB') : '—'}`} />
                <div className="flex gap-2 flex-wrap">
                  <Button className="rounded-2xl" onClick={() => setPage('Responses & Controls')}>Add response</Button>
                  <Button variant="outline" className="rounded-2xl">Submit for review</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-3xl"><CardContent className="p-12 text-center text-slate-400">Select a risk to view details</CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANNUAL ASSESSMENT — live API data + persistence
// ═══════════════════════════════════════════════════════════════
function AnnualAssessmentPage() {
  const [step, setStep] = useState('changes');
  const [risks, setRisks] = useState([]);
  const [deficiencies, setDeficiencies] = useState([]);
  const [responses, setResponses] = useState([]);
  const [assessment, setAssessment] = useState({ summary_of_changes: '', risk_summary: '', deficiency_summary: '', conclusion: '', is_effective: null });
  const [assessmentId, setAssessmentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [riskStatuses, setRiskStatuses] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/api/risks').then(r => r.data).catch(() => []),
      api.get('/api/monitoring/deficiencies').then(r => r.data).catch(() => []),
      api.get('/api/responses').then(r => r.data).catch(() => []),
      api.get('/api/assessment/2026').then(r => r.data).catch(() => null),
    ]).then(([r, d, resp, existing]) => {
      setRisks(r); setDeficiencies(d); setResponses(resp);
      if (existing) {
        setAssessment({ summary_of_changes: existing.summary_of_changes || '', risk_summary: existing.risk_summary || '', deficiency_summary: existing.deficiency_summary || '', conclusion: existing.conclusion || '', is_effective: existing.is_effective });
        setAssessmentId(existing.id);
        try { setRiskStatuses(JSON.parse(existing.risk_summary) || {}); } catch(e) {}
      }
      setLoading(false);
    });
  }, []);

  function saveAssessment() {
    setSaving(true);
    const payload = { ...assessment, year: 2026, risk_summary: JSON.stringify(riskStatuses) };
    const req = assessmentId
      ? api.put(`/api/assessment/${assessmentId}`, payload)
      : api.post('/api/assessment', payload);
    req.then(r => { if (r.data?.id) setAssessmentId(r.data.id); setSaving(false); alert('Assessment saved.'); })
      .catch(() => { setSaving(false); alert('Save failed.'); });
  }

  if (loading) return <Spinner />;

  const activeRisks = risks.filter(r => r.status !== 'archived');
  const openDef = deficiencies.filter(d => d.status !== 'closed');

  return (
    <div>
      <PageHeader eyebrow="Annual Assessment — CLA Romania" title="ISQM-1 annual evaluation"
        subtitle={`Review changes, ${activeRisks.length} risks, ${openDef.length} open deficiencies, ${responses.length} responses. Target: December 2026.`}
        actions={[
          <Button key="1" className="rounded-2xl" onClick={saveAssessment} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save assessment</>}
          </Button>
        ]} />
      <Tabs value={step} onValueChange={setStep} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 rounded-2xl h-auto p-1">
          <TabsTrigger value="changes" className="rounded-xl">1. Changes</TabsTrigger>
          <TabsTrigger value="risks" className="rounded-xl">2. Risks ({activeRisks.length})</TabsTrigger>
          <TabsTrigger value="deficiencies" className="rounded-xl">3. Deficiencies ({openDef.length})</TabsTrigger>
          <TabsTrigger value="responses" className="rounded-xl">4. Responses ({responses.length})</TabsTrigger>
          <TabsTrigger value="conclusion" className="rounded-xl">5. Conclusion</TabsTrigger>
          <TabsTrigger value="signoff" className="rounded-xl">6. Sign-off</TabsTrigger>
        </TabsList>

        <TabsContent value="changes"><Card className="rounded-3xl"><CardHeader><CardTitle>Changes in circumstances — 2026</CardTitle><CardDescription>What changed in services, staffing, systems, governance.</CardDescription></CardHeader>
          <CardContent>
            <Textarea className="min-h-48 rounded-2xl" value={assessment.summary_of_changes} onChange={e => setAssessment(a => ({...a, summary_of_changes: e.target.value}))} placeholder="Describe changes in services, staffing, systems, and governance that occurred during the assessment period..." />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="risks"><Card className="rounded-3xl"><CardHeader><CardTitle>Risk review</CardTitle><CardDescription>Assess each risk — has it changed since last period?</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {activeRisks.length === 0 ? <div className="text-sm text-slate-400 text-center py-8">No risks to review. Add risks in the Risk Register first.</div> : activeRisks.map(risk => (
              <div key={risk.id} className="rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div><div className="font-medium text-slate-900">QR-{risk.id} — {risk.title}</div><div className="text-sm text-slate-500 mt-1">{risk.component_name} · {risk.owner_name || '—'} · Residual {risk.residual_score || '—'}</div></div>
                <div className="flex gap-2 flex-wrap">{['Unchanged', 'Increased', 'Decreased', 'Closed'].map(l => (
                  <Button key={l} variant={riskStatuses[risk.id] === l ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setRiskStatuses(s => ({...s, [risk.id]: l}))}>{l}</Button>
                ))}</div>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="deficiencies"><Card className="rounded-3xl"><CardHeader><CardTitle>Deficiency review</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {deficiencies.length === 0 ? <div className="text-sm text-slate-400 text-center py-8">No deficiencies recorded.</div> : deficiencies.map(d => (
              <div key={d.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4">
                <div><div className="font-medium">{d.title}</div><div className="text-sm text-slate-500 mt-1">{d.severity} severity · {d.root_cause || 'No root cause documented'}</div></div>
                <StatusBadge value={d.status === 'closed' ? 'Approved' : d.status === 'open' ? 'Active' : 'In Review'} />
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="responses"><Card className="rounded-3xl"><CardHeader><CardTitle>Response effectiveness</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {responses.length === 0 ? <div className="text-sm text-slate-400 text-center py-8">No responses recorded.</div> : responses.map(r => (
              <div key={r.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4">
                <div><div className="font-medium">{r.title}</div><div className="text-sm text-slate-500 mt-1">{r.description ? r.description.substring(0, 80) : 'No description'}</div></div>
                <StatusBadge value={r.status === 'implemented' ? 'Approved' : r.status === 'draft' ? 'Draft' : 'In Review'} />
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="conclusion"><Card className="rounded-3xl"><CardHeader><CardTitle>Draft conclusion</CardTitle></CardHeader>
          <CardContent>
            <Textarea className="min-h-72 rounded-2xl" value={assessment.conclusion} onChange={e => setAssessment(a => ({...a, conclusion: e.target.value}))} placeholder="Based on the procedures performed during the assessment period, conclude whether the SoQM provides reasonable assurance..." />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="signoff"><Card className="rounded-3xl"><CardHeader><CardTitle>Sign-off</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border p-4"><div className="text-sm text-slate-500 mb-2">Assessment conclusion</div><div className="font-medium">{assessment.is_effective === true ? 'Effective' : assessment.is_effective === false ? 'Not effective' : 'Not yet determined'}</div></div>
              <div className="flex gap-3">
                <Button variant={assessment.is_effective === true ? 'default' : 'outline'} className="rounded-2xl flex-1" onClick={() => setAssessment(a => ({...a, is_effective: true}))}>Effective</Button>
                <Button variant={assessment.is_effective === false ? 'default' : 'outline'} className="rounded-2xl flex-1" onClick={() => setAssessment(a => ({...a, is_effective: false}))}>Not effective</Button>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border p-4"><Checkbox id="declare" className="mt-1" /><label htmlFor="declare" className="text-sm text-slate-700 leading-6">I confirm that the annual assessment has considered changes in circumstances, open deficiencies, response effectiveness, and unresolved high-risk matters before approval. This assessment is submitted for CAFR compliance.</label></div>
            <Button className="rounded-2xl" onClick={saveAssessment} disabled={saving}>{saving ? 'Saving...' : 'Approve annual assessment'}</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FIRM SETUP — live API data + persistence
// ═══════════════════════════════════════════════════════════════
function FirmSetupPage() {
  const [org, setOrg] = useState({ name: '', jurisdiction: '', legal_structure: '', network: '', description: '', partner_count: '', staff_count: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/organization').then(r => {
      if (r.data) setOrg({ name: r.data.name || '', jurisdiction: r.data.jurisdiction || '', legal_structure: r.data.legal_structure || '', network: r.data.network || '', description: r.data.description || '', partner_count: r.data.partner_count || '', staff_count: r.data.staff_count || '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function saveOrg() {
    setSaving(true);
    api.put('/api/organization', org)
      .then(() => { setSaving(false); alert('Firm profile saved.'); })
      .catch(() => { setSaving(false); alert('Save failed.'); });
  }

  function field(label, key, type) {
    return (
      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
        {type === 'textarea'
          ? <Textarea className="rounded-2xl min-h-32" value={org[key]} onChange={e => setOrg(o => ({...o, [key]: e.target.value}))} />
          : <Input className="rounded-2xl" value={org[key]} onChange={e => setOrg(o => ({...o, [key]: e.target.value}))} />}
      </div>
    );
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader eyebrow="Firm Setup — CLA Romania" title="Firm context for the quality system" subtitle="ISQM-1 requires the SoQM to reflect the nature and circumstances of the firm."
        actions={[<Button key="1" className="rounded-2xl" onClick={saveOrg} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save profile</>}</Button>]} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.4fr]">
        <Card className="rounded-3xl"><CardHeader><CardTitle>Setup progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">{[
            ['Firm Profile', !!org.name], ['Jurisdiction', !!org.jurisdiction], ['Legal Structure', !!org.legal_structure],
            ['Network', !!org.network], ['Partners & Staff', !!org.partner_count], ['Description', !!org.description],
          ].map(([label, done]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border p-4"><span className="text-sm font-medium text-slate-700">{label}</span>{done ? <Badge className="rounded-full bg-emerald-100 text-emerald-700">Complete</Badge> : <Badge className="rounded-full bg-amber-100 text-amber-700">Pending</Badge>}</div>
          ))}</CardContent>
        </Card>
        <Card className="rounded-3xl"><CardHeader><CardTitle>Firm profile</CardTitle></CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            {field('Firm name', 'name')}
            {field('Jurisdiction', 'jurisdiction')}
            {field('Legal structure', 'legal_structure')}
            {field('Network', 'network')}
            {field('Partner count', 'partner_count')}
            {field('Staff count', 'staff_count')}
            <div className="lg:col-span-2">{field('Description', 'description', 'textarea')}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DOCUMENTS — live API data
// ═══════════════════════════════════════════════════════════════
function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const DOC_TYPES = [
    { type: 'manual', label: 'ISQM-1 Manual', desc: 'Full quality management manual with firm profile, components, objectives, risks, and responses' },
    { type: 'risk_register', label: 'Quality Risk Register', desc: 'All quality risks with scoring, owners, and mitigation status' },
    { type: 'deficiency_log', label: 'Deficiency Log', desc: 'All deficiencies with severity, remediation status, and root cause analysis' },
    { type: 'assessment_report', label: 'Annual Assessment Report', desc: 'Assessment conclusion, risk review, deficiency review, sign-off status' },
  ];

  useEffect(() => {
    api.get('/api/documents').then(r => { setDocs(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function generateDoc(type) {
    setGenerating(true);
    api.post('/api/documents/generate', { type })
      .then(r => {
        const newDoc = r.data;
        setDocs(prev => [newDoc, ...prev]);
        setSelected(newDoc);
        setGenerating(false);
      })
      .catch(err => { alert(err.response?.data?.error || 'Generation failed'); setGenerating(false); });
  }

  function approveDoc(id) {
    api.post(`/api/documents/${id}/approve`)
      .then(r => {
        setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
        if (selected?.id === id) setSelected(s => ({ ...s, status: 'approved' }));
      })
      .catch(err => alert(err.response?.data?.error || 'Approval failed'));
  }

  const typeLabel = { manual: 'ISQM-1 Manual', risk_register: 'Risk Register', deficiency_log: 'Deficiency Log', assessment_report: 'Assessment Report' };

  return (
    <div>
      <PageHeader eyebrow="Documents — CLA Romania" title="Generate and govern ISQM-1 outputs"
        subtitle={`${docs.length} document${docs.length !== 1 ? 's' : ''} generated. Approved versions are immutable.`} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr_0.8fr]">
        {/* Generate */}
        <div className="space-y-4">
          <Card className="rounded-3xl"><CardHeader><CardTitle>Generate new</CardTitle></CardHeader>
            <CardContent className="space-y-2">{DOC_TYPES.map(dt => (
              <button key={dt.type} className="w-full rounded-2xl border p-4 text-left hover:bg-slate-50 transition" onClick={() => generateDoc(dt.type)} disabled={generating}>
                <div className="font-medium text-slate-900">{dt.label}</div>
                <div className="text-sm text-slate-500 mt-1">{dt.desc}</div>
              </button>
            ))}</CardContent>
          </Card>
          {docs.length > 0 && (
            <Card className="rounded-3xl"><CardHeader><CardTitle>History ({docs.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">{docs.map(d => (
                <button key={d.id} className={`w-full rounded-2xl border p-3 text-left hover:bg-slate-50 transition text-sm ${selected?.id === d.id ? 'border-slate-900 bg-slate-50' : ''}`} onClick={() => setSelected(d)}>
                  <div className="font-medium text-slate-900">{typeLabel[d.type] || d.type}</div>
                  <div className="text-slate-500 mt-0.5">v{d.version} · {d.status} · {new Date(d.created_at).toLocaleDateString('en-GB')}</div>
                </button>
              ))}</CardContent>
            </Card>
          )}
        </div>
        {/* Preview */}
        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Preview</CardTitle>{selected && <CardDescription>{typeLabel[selected.type]} v{selected.version}</CardDescription>}</CardHeader>
          <CardContent>
            {loading ? <Spinner /> : !selected ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <div className="font-medium">Select a document or generate one</div>
                <div className="text-sm mt-1">Click any document type on the left to generate from live data</div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-slate-50 p-6 min-h-[420px] space-y-3">
                <div className="flex items-center justify-between">
                  <StatusBadge value={selected.status === 'approved' ? 'Approved' : 'Draft'} />
                  <span className="text-xs text-slate-400 font-mono">v{selected.version} · {new Date(selected.created_at).toLocaleDateString('en-GB')}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{typeLabel[selected.type] || selected.type}</h3>
                <p className="text-sm text-slate-600 leading-6">Generated from live system data on {new Date(selected.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. Contains current state of all {selected.type === 'manual' ? 'components, objectives, risks, and responses' : selected.type === 'risk_register' ? 'quality risks with scoring and owners' : selected.type === 'deficiency_log' ? 'deficiencies with remediation status' : 'assessment conclusions and sign-off data'}.</p>
                <Separator />
                <div className="text-xs text-slate-400">Full document content stored in database. Export to PDF coming in Wave 2.</div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Metadata */}
        <Card className="rounded-3xl"><CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            {selected ? (<>
              <MetaRow label="Type" value={typeLabel[selected.type] || selected.type} />
              <MetaRow label="Version" value={`v${selected.version} (${selected.status})`} />
              <MetaRow label="Generated" value={new Date(selected.created_at).toLocaleDateString('en-GB')} />
              <MetaRow label="Status" value={selected.status} />
              <MetaRow label="Firm" value="CLA Romania SRL" />
              <MetaRow label="Regulator" value="CAFR" />
              <Separator />
              <div className="flex flex-col gap-2">
                {selected.status !== 'approved' && <Button className="rounded-2xl" onClick={() => approveDoc(selected.id)}>Approve version</Button>}
                <Button variant="outline" className="rounded-2xl" onClick={() => generateDoc(selected.type)}>Generate new version</Button>
              </div>
            </>) : <div className="text-slate-400">Select a document to view metadata</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, subtitle, icon: Icon }) {
  return (
    <div>
      <PageHeader eyebrow={title} title={title} subtitle={subtitle} />
      <Card className="rounded-3xl"><CardContent className="p-10 flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="h-16 w-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4"><Icon className="h-8 w-8 text-slate-700" /></div>
        <h3 className="text-2xl font-semibold text-slate-900">Coming in Wave 2</h3>
        <p className="text-slate-600 mt-3 max-w-2xl">This module follows the same design patterns and will be connected to the PostgreSQL backend with full CRUD, audit trail, and sign-off workflows.</p>
      </CardContent></Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [readiness, setReadiness] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('isqm_token');
    if (token) {
      api.get('/api/auth/me').then(r => setUser(r.data)).catch(() => { localStorage.removeItem('isqm_token'); });
    }
  }, []);

  // Compute readiness from objectives
  useEffect(() => {
    if (!user) return;
    api.get('/api/objectives').then(r => {
      const obj = r.data || [];
      const impl = obj.filter(o => o.status === 'implemented').length;
      setReadiness(obj.length ? Math.round((impl / obj.length) * 100) : 0);
    }).catch(() => {});
  }, [user, page]);

  function handleLogout() { localStorage.removeItem('isqm_token'); setUser(null); }
  if (!user) return <LoginPage onLogin={setUser} />;

  const pages = {
    Dashboard: <DashboardPage setPage={setPage} />,
    'Firm Setup': <FirmSetupPage />,
    'Quality System': <QualitySystemPage />,
    'Risk Register': <RiskRegisterPage setPage={setPage} />,
    'Responses & Controls': <ResponsesControlsPage />,
    Monitoring: <MonitoringPage />,
    Deficiencies: <DeficienciesPage />,
    'Annual Assessment': <AnnualAssessmentPage />,
    Documents: <DocumentsPage />,
    'Add Risk': <RiskEntryPage onBack={() => setPage('Risk Register')} />,
    Import: <ImportPage />,
    Help: <HelpPage />,
    Admin: <AdminPage />,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar page={page} setPage={setPage} onLogout={handleLogout} readiness={readiness} />
        <main className="flex-1 min-w-0"><TopBar user={user} /><div className="p-6 lg:p-8">{pages[page] || <DashboardPage setPage={setPage} />}</div></main>
      </div>
    </div>
  );
}
