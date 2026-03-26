import React, { useMemo, useState } from 'react';
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
import { Search, Bell, Building2, ShieldCheck, AlertTriangle, FileText, ClipboardList, LayoutDashboard, Settings, ChevronRight, CheckCircle2, Clock3, Users, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';
import QualitySystemPage from '@/pages/QualitySystem';
import ResponsesControlsPage from '@/pages/ResponsesControls';
import MonitoringPage from '@/pages/Monitoring';
import DeficienciesPage from '@/pages/Deficiencies';
import AdminPage from '@/pages/Admin';

const NAV_ITEMS = ['Dashboard','Firm Setup','Quality System','Risk Register','Responses & Controls','Monitoring','Deficiencies','Annual Assessment','Documents','Admin'];

const KPI_CARDS = [
  { title: 'Open Quality Risks', value: '29', subtext: '7 high residual · CLA Romania Audit', icon: AlertTriangle },
  { title: 'Open Deficiencies', value: '4', subtext: 'BUSTEC TB mapping, CPD shortfall', icon: ClipboardList },
  { title: 'Assessment Readiness', value: '72%', subtext: 'First evaluation: Dec 2026', icon: CheckCircle2 },
  { title: 'Controls Requiring Review', value: '8', subtext: 'Next 30 days', icon: Clock3 },
];

const SAMPLE_RISKS = [
  { id: 'QR-5.1', title: 'Insufficient qualified staff for engagement demands', component: 'Resources', practice: 'Audit', inherent: 20, residual: 12, owner: 'Irina Sofron', status: 'Active', nextReview: '2026-04-15', description: 'The firm may not have sufficient qualified audit staff during peak periods (Q1 year-end audits + D300 deadline overlap), creating risk of under-staffed engagement teams.', rootCause: 'CLA Romania has 8 audit staff covering 8 audit clients. 2 open positions unfilled >30 days.' },
  { id: 'QR-3.1', title: 'Client accepted without adequate risk assessment', component: 'Acceptance & Continuance', practice: 'Audit', inherent: 15, residual: 10, owner: 'Laurentiu Vasile', status: 'Active', nextReview: '2026-05-01', description: 'New audit clients may be accepted without sufficient AML/KYC checks or risk assessment, particularly during periods of rapid growth.', rootCause: 'Client acceptance form redesigned Q1 2026 — not yet tested with all partners. Manual process.' },
  { id: 'QR-4.2', title: 'Complex matters not escalated for consultation', component: 'Engagement Performance', practice: 'Audit', inherent: 16, residual: 8, owner: 'Laurentiu Vasile', status: 'Mitigated', nextReview: '2026-04-28', description: 'Complex accounting or auditing matters may not be escalated for partner consultation, particularly on non-PIE engagements.', rootCause: 'Consultation policy defines triggers but enforcement relies on team judgment. No automated escalation.' },
  { id: 'QR-7.2', title: 'Root causes of deficiencies not identified', component: 'Monitoring & Remediation', practice: 'All', inherent: 20, residual: 16, owner: 'Ionut Zeche', status: 'Active', nextReview: '2026-04-30', description: 'When cold file reviews identify issues, the firm may not perform adequate root cause analysis to prevent recurrence.', rootCause: 'Root cause analysis process documented but not yet applied to Q1 findings. First application pending.' },
  { id: 'QR-2.4', title: 'Inadequate safeguards for independence threats', component: 'Relevant Ethical Requirements', practice: 'Audit', inherent: 15, residual: 10, owner: 'Crina Stancu', status: 'Active', nextReview: '2026-04-15', description: 'Identified threats to independence may not have adequate documented safeguards, particularly for non-listed audit clients.', rootCause: 'Safeguards documentation 80% complete. Remaining 20% covers smaller engagements.' },
];

const DOCUMENTS = [
  { name: 'ISQM-1 Manual — CLA Romania', version: 'v1', status: 'Draft', date: '2026-03-27' },
  { name: 'Quality Risk Register', version: 'v3', status: 'Draft', date: '2026-03-27' },
  { name: 'Responses & Controls Matrix', version: 'v2', status: 'Draft', date: '2026-03-25' },
  { name: 'Monitoring Plan 2026', version: 'v1', status: 'Approved', date: '2026-01-15' },
  { name: 'Annual Assessment Report', version: 'v0', status: 'Not started', date: '—' },
];

function cn(...classes) { return classes.filter(Boolean).join(' '); }

function StatusBadge({ value }) {
  const map = { Draft: 'bg-slate-100 text-slate-700', 'In Review': 'bg-amber-100 text-amber-700', Approved: 'bg-emerald-100 text-emerald-700', Active: 'bg-rose-100 text-rose-700', Mitigated: 'bg-blue-100 text-blue-700', 'Not started': 'bg-slate-100 text-slate-500' };
  return <Badge className={cn('rounded-full px-3 py-1', map[value] || 'bg-slate-100 text-slate-700')}>{value}</Badge>;
}

function SeverityBadge({ score }) {
  const label = score >= 12 ? 'High' : score >= 8 ? 'Medium' : 'Low';
  const cls = score >= 12 ? 'bg-rose-100 text-rose-700' : score >= 8 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
  return <Badge className={cn('rounded-full px-3 py-1', cls)}>{label}</Badge>;
}

function Section({ title, body }) { return <div className="rounded-2xl border p-4"><div className="text-sm text-slate-500 mb-2">{title}</div><div className="text-sm text-slate-700 leading-6">{body}</div></div>; }
function MetaRow({ label, value }) { return <div className="space-y-1"><div className="text-slate-500">{label}</div><div className="text-slate-900 font-medium">{value}</div></div>; }

function Sidebar({ page, setPage }) {
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col border-r bg-white/70 backdrop-blur-sm">
      <div className="p-5 border-b">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm"><ShieldCheck className="h-5 w-5" /></div>
          <div><div className="font-semibold text-slate-900">ISQM-1 Builder</div><div className="text-sm text-slate-500">CLA Romania · Audit</div></div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button key={item} onClick={() => setPage(item)} className={cn('w-full rounded-2xl px-4 py-3 text-left text-sm transition flex items-center justify-between', item === page ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100')}>
              <span>{item}</span><ChevronRight className="h-4 w-4 opacity-60" />
            </button>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Compliance status</div>
          <div className="text-2xl font-semibold text-slate-900 mb-1">72%</div>
          <Progress value={72} className="h-2 mb-2" />
          <div className="text-xs text-slate-500">22 of 29 quality objectives addressed. First annual evaluation: Dec 2026.</div>
        </div>
      </ScrollArea>
    </aside>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div>
          <div className="text-sm text-slate-500">System of Quality Management</div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <StatusBadge value="Draft" />
            <Badge variant="outline" className="rounded-full">7 high residual risks</Badge>
            <Badge variant="outline" className="rounded-full">4 open deficiencies</Badge>
            <Badge variant="outline" className="rounded-full">CAFR evaluation: Dec 2026</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="w-72 rounded-2xl pl-9" placeholder="Search risks, controls, documents..." /></div>
          <Button variant="outline" size="icon" className="rounded-2xl"><Bell className="h-4 w-4" /></Button>
          <Button variant="outline" className="rounded-2xl gap-2"><Building2 className="h-4 w-4" /> CLA Romania</Button>
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

function KpiCard({ title, value, subtext, icon: Icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-3xl border-slate-200 shadow-sm"><CardContent className="p-6"><div className="flex items-start justify-between"><div><div className="text-sm text-slate-500">{title}</div><div className="text-3xl font-semibold mt-2 text-slate-900">{value}</div><div className="text-sm text-slate-500 mt-2">{subtext}</div></div><div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center"><Icon className="h-5 w-5 text-slate-700" /></div></div></CardContent></Card>
    </motion.div>
  );
}

function DashboardPage({ setPage }) {
  return (
    <div>
      <PageHeader eyebrow="Dashboard — CLA Romania Audit" title="Run your quality system with clarity" subtitle="ISQM-1 compliance tracker for CLA Romania. 8 components, 29 quality risks, 8 monitoring activities. First annual evaluation: December 2026."
        actions={[<Button key="1" className="rounded-2xl" onClick={() => setPage('Annual Assessment')}>Start annual assessment</Button>, <Button key="2" variant="outline" className="rounded-2xl" onClick={() => setPage('Documents')}>Generate board summary</Button>]} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{KPI_CARDS.map((card) => <KpiCard key={card.title} {...card} />)}</div>
      <div className="grid gap-4 xl:grid-cols-3 mt-6">
        <Card className="rounded-3xl xl:col-span-2"><CardHeader><CardTitle>Risk by component — CLA Romania</CardTitle><CardDescription>Residual risk concentration. Focus: Resources and Monitoring & Remediation.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {[['Governance & Leadership', 15, 'Ionut Zeche'], ['Relevant Ethical Requirements', 20, 'Crina Stancu'], ['Acceptance & Continuance', 35, 'Laurentiu Vasile'], ['Engagement Performance', 30, 'Laurentiu Vasile'], ['Resources', 40, 'Irina Sofron'], ['Information & Communication', 25, 'Irina Sofron'], ['Monitoring & Remediation', 50, 'Laurentiu Vasile'], ['Risk Assessment Process', 22, 'Ionut Zeche']].map(([label, pct, owner]) => (
              <div key={label} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="text-slate-700">{label}</span><span className="text-slate-500">{owner} · {pct}%</span></div><Progress value={pct} className="h-2" /></div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-3xl"><CardHeader><CardTitle>Priority actions</CardTitle><CardDescription>Items requiring immediate attention.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {['Run Q1 client acceptance review (overdue)', 'Apply root cause analysis to cold file findings (BUSTEC, Farmexpert)', 'Complete safeguards documentation — 20% remaining (Crina S.)', 'Define quality infrastructure budget (Ionut Z.)', 'Staff turnover retention programme (Irina S.)', 'Draft CAFR transparency report (Laurentiu V.)'].map((item) => (
              <div key={item} className="rounded-2xl border p-4 text-sm text-slate-700">{item}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RiskRegisterPage() {
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState(SAMPLE_RISKS[0]);
  const filtered = useMemo(() => SAMPLE_RISKS.filter((r) => [r.title, r.component, r.practice, r.owner].join(' ').toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <div>
      <PageHeader eyebrow="Risk Register — CLA Romania" title="Review, score, and manage quality risks" subtitle="29 quality risks across 8 ISQM-1 components. Every risk must have a clear owner, score, response, and next review date."
        actions={[<Button key="1" className="rounded-2xl">Add risk</Button>, <Button key="2" variant="outline" className="rounded-2xl">Export filtered view</Button>]} />
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <Card className="rounded-3xl overflow-hidden">
          <CardHeader className="border-b"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><CardTitle>Quality risks</CardTitle><CardDescription>Sorted by residual score. Click a row for details.</CardDescription></div><Input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-2xl w-72" placeholder="Search risks..." /></div></CardHeader>
          <CardContent className="p-0">
            <Table><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Risk</TableHead><TableHead>Component</TableHead><TableHead>Residual</TableHead><TableHead>Owner</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{filtered.map((risk) => (
                <TableRow key={risk.id} className="cursor-pointer" onClick={() => setSelectedRisk(risk)}>
                  <TableCell className="font-mono text-xs">{risk.id}</TableCell><TableCell className="font-medium">{risk.title}</TableCell><TableCell>{risk.component}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><span>{risk.residual}</span><SeverityBadge score={risk.residual} /></div></TableCell>
                  <TableCell>{risk.owner}</TableCell><TableCell><StatusBadge value={risk.status} /></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="rounded-3xl"><CardHeader><CardTitle>{selectedRisk.id} — Detail</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div><div className="flex items-center gap-2 flex-wrap mb-2"><StatusBadge value={selectedRisk.status} /><Badge variant="outline" className="rounded-full">{selectedRisk.component}</Badge><Badge variant="outline" className="rounded-full">{selectedRisk.practice}</Badge></div><h3 className="text-xl font-semibold text-slate-900">{selectedRisk.title}</h3></div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-sm text-slate-500">Inherent</div><div className="text-2xl font-semibold mt-1">{selectedRisk.inherent}</div></CardContent></Card>
              <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-sm text-slate-500">Residual</div><div className="text-2xl font-semibold mt-1">{selectedRisk.residual}</div></CardContent></Card>
            </div>
            <Section title="Description" body={selectedRisk.description} />
            <Section title="Root cause" body={selectedRisk.rootCause} />
            <Section title="Owner" body={`${selectedRisk.owner} · Next review ${selectedRisk.nextReview}`} />
            <div className="flex gap-2 flex-wrap"><Button className="rounded-2xl">Add response</Button><Button variant="outline" className="rounded-2xl">Submit for review</Button><Button variant="outline" className="rounded-2xl">Mark mitigated</Button></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnnualAssessmentPage() {
  const [step, setStep] = useState('changes');
  return (
    <div>
      <PageHeader eyebrow="Annual Assessment — CLA Romania" title="ISQM-1 annual evaluation" subtitle="Review changes, risks, deficiencies, response effectiveness, and conclude whether the SoQM provides reasonable assurance. Target: December 2026."
        actions={[<Button key="1" className="rounded-2xl">Generate assessment report</Button>]} />
      <Tabs value={step} onValueChange={setStep} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 rounded-2xl h-auto p-1">
          <TabsTrigger value="changes" className="rounded-xl">1. Changes</TabsTrigger><TabsTrigger value="risks" className="rounded-xl">2. Risks</TabsTrigger><TabsTrigger value="deficiencies" className="rounded-xl">3. Deficiencies</TabsTrigger><TabsTrigger value="responses" className="rounded-xl">4. Responses</TabsTrigger><TabsTrigger value="conclusion" className="rounded-xl">5. Conclusion</TabsTrigger><TabsTrigger value="signoff" className="rounded-xl">6. Sign-off</TabsTrigger>
        </TabsList>
        <TabsContent value="changes"><Card className="rounded-3xl"><CardHeader><CardTitle>Changes in circumstances — CLA Romania 2026</CardTitle><CardDescription>What changed in services, staffing, systems, governance.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <Textarea className="min-h-36 rounded-2xl" defaultValue="Services: Added Transfer Pricing and M&A Transaction advisory. Expanded BPS outsourcing scope. AI Hub deployed (24 tools). CaseWare Cloud migration completed." />
            <Textarea className="min-h-36 rounded-2xl" defaultValue="Staffing: 2 open audit positions. Alina Artemenko joined as AI & Technology manager. Qasim Razvan promoted to Senior Manager (BPS). Staff count: 42." />
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="risks"><Card className="rounded-3xl"><CardHeader><CardTitle>Risk review</CardTitle><CardDescription>Assess high residual risks and newly added risks.</CardDescription></CardHeader>
          <CardContent className="space-y-4">{SAMPLE_RISKS.map((risk) => (
            <div key={risk.id} className="rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div><div className="font-medium text-slate-900">{risk.id} — {risk.title}</div><div className="text-sm text-slate-500 mt-1">{risk.component} · {risk.owner} · Residual {risk.residual}</div></div>
              <div className="flex gap-2 flex-wrap">{['Unchanged', 'Increased', 'Decreased', 'Closed'].map((l) => <Button key={l} variant="outline" className="rounded-2xl">{l}</Button>)}</div>
            </div>
          ))}</CardContent></Card>
        </TabsContent>
        <TabsContent value="deficiencies"><Card className="rounded-3xl"><CardHeader><CardTitle>Deficiency review — CLA Romania</CardTitle></CardHeader>
          <CardContent className="space-y-4">{[
            ['DEF-001: Audit file review notes not cleared (Farmexpert)', 'High', 'In remediation'],
            ['DEF-002: Engagement letters missing 2026 terms', 'Minor', 'Remediated'],
            ['DEF-003: CPD shortfall for 2 staff', 'Moderate', 'In remediation'],
            ['DEF-004: CaseWare TB mapping exceptions (BUSTEC)', 'Minor', 'Open'],
          ].map(([item, sev, status]) => (
            <div key={item} className="rounded-2xl border p-4 flex items-center justify-between gap-4"><div><div className="font-medium">{item}</div><div className="text-sm text-slate-500 mt-1">{sev} severity</div></div><StatusBadge value={status === 'Remediated' ? 'Approved' : status === 'Open' ? 'Active' : 'In Review'} /></div>
          ))}</CardContent></Card>
        </TabsContent>
        <TabsContent value="responses"><Card className="rounded-3xl"><CardHeader><CardTitle>Response effectiveness</CardTitle></CardHeader>
          <CardContent className="space-y-4">{[
            ['Cold file review programme (3 files/quarter)', 'Effective'],
            ['Independence confirmation process (annual)', 'Effective'],
            ['Client acceptance AML/KYC integration', 'Unknown'],
            ['Consultation escalation protocol', 'Effective'],
            ['CaseWare file assembly 60-day tracking', 'Effective'],
            ['Root cause analysis process', 'Ineffective'],
          ].map(([name, status]) => (
            <div key={name} className="rounded-2xl border p-4 flex items-center justify-between gap-4"><div><div className="font-medium">{name}</div></div><StatusBadge value={status === 'Effective' ? 'Approved' : status === 'Ineffective' ? 'Active' : 'Draft'} /></div>
          ))}</CardContent></Card>
        </TabsContent>
        <TabsContent value="conclusion"><Card className="rounded-3xl"><CardHeader><CardTitle>Draft conclusion</CardTitle></CardHeader>
          <CardContent><Textarea className="min-h-72 rounded-2xl" defaultValue={`Based on the procedures performed during the period from January to December 2026, CLA Romania concludes that the System of Quality Management provides reasonable assurance that the objectives of the system are being achieved, except for:\n\n1. Root cause analysis process — not yet applied to Q1 cold file review findings (remediation target: Q2 2026)\n2. Client acceptance review — Q1 review overdue (immediate action required)\n\nThese matters have been communicated to relevant partners with assigned remediation actions and deadlines. The firm will re-assess effectiveness in the Q2 monitoring cycle.\n\nSigned: Ionut Zeche, Managing Partner\nReviewed: Laurentiu Vasile, Quality & Risk Partner`} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="signoff"><Card className="rounded-3xl"><CardHeader><CardTitle>Sign-off — CLA Romania</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3"><Input className="rounded-2xl" defaultValue="Laurentiu Vasile — Quality Partner" /><Input className="rounded-2xl" defaultValue="Ionut Zeche — Managing Partner" /><Input className="rounded-2xl" defaultValue="Partner Board" /></div>
            <div className="flex items-start gap-3 rounded-2xl border p-4"><Checkbox id="declare" className="mt-1" /><label htmlFor="declare" className="text-sm text-slate-700 leading-6">I confirm that the annual assessment has considered changes in circumstances, open deficiencies, response effectiveness, and unresolved high-risk matters before approval. This assessment is submitted for CAFR compliance.</label></div>
            <Button className="rounded-2xl">Approve annual assessment</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentsPage() {
  return (
    <div>
      <PageHeader eyebrow="Documents — CLA Romania" title="Generate and govern ISQM-1 outputs" subtitle="Documents generated from structured system data. Approved versions are immutable."
        actions={[<Button key="1" className="rounded-2xl">Generate document</Button>, <Button key="2" variant="outline" className="rounded-2xl">Export PDF</Button>]} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr_0.8fr]">
        <Card className="rounded-3xl"><CardHeader><CardTitle>Document types</CardTitle></CardHeader>
          <CardContent className="space-y-2">{DOCUMENTS.map((doc) => (
            <button key={doc.name} className="w-full rounded-2xl border p-4 text-left hover:bg-slate-50 transition"><div className="font-medium text-slate-900">{doc.name}</div><div className="text-sm text-slate-500 mt-1">{doc.version} · {doc.status} · {doc.date}</div></button>
          ))}</CardContent>
        </Card>
        <Card className="rounded-3xl"><CardHeader><CardTitle>Preview</CardTitle><CardDescription>ISQM-1 Manual — CLA Romania</CardDescription></CardHeader>
          <CardContent><div className="rounded-2xl border bg-slate-50 p-6 min-h-[420px] space-y-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Section 1</div>
            <h3 className="text-2xl font-semibold">Nature and circumstances of the firm</h3>
            <p className="text-slate-700 leading-7">CLA Romania SRL is a member firm of CLA Global, registered in Bucharest. The firm delivers Audit, Tax Compliance, Tax Advisory, BPS, Legal, Transfer Pricing, Mobility, and M&A services through 42 professionals across 8 practices. The firm's audit practice serves 8 statutory audit clients and is supervised by CAFR (Camera Auditorilor Financiari din Romania).</p>
            <Separator />
            <div className="text-xs uppercase tracking-wide text-slate-500">Section 2</div>
            <h3 className="text-xl font-semibold">Governance and leadership</h3>
            <p className="text-slate-700 leading-7">Quality governance is led by Ionut Zeche (Managing Partner) with Laurentiu Vasile appointed as Quality & Risk Partner. Quality is discussed at every partner meeting and forms part of partner performance evaluation.</p>
          </div></CardContent>
        </Card>
        <Card className="rounded-3xl"><CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <MetaRow label="Version" value="v1 (Draft)" /><MetaRow label="Status" value="Draft" /><MetaRow label="Generated" value="27 Mar 2026" /><MetaRow label="Generated by" value="Laurentiu Vasile" /><MetaRow label="Firm" value="CLA Romania SRL" /><MetaRow label="Regulator" value="CAFR" />
            <Separator /><div className="flex flex-col gap-2"><Button className="rounded-2xl">Approve version</Button><Button variant="outline" className="rounded-2xl">Save as new version</Button></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FirmSetupPage() {
  return (
    <div>
      <PageHeader eyebrow="Firm Setup — CLA Romania" title="Firm context for the quality system" subtitle="ISQM-1 requires the SoQM to reflect the nature and circumstances of the firm." actions={[<Button key="1" className="rounded-2xl">Save and continue</Button>]} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.4fr]">
        <Card className="rounded-3xl"><CardHeader><CardTitle>Setup progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">{[['Firm Profile', true], ['Offices', true], ['Practices', true], ['Service Lines', true], ['Governance Roles', true], ['Technology & Outsourcing', false], ['Review', false]].map(([label, done]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border p-4"><span className="text-sm font-medium text-slate-700">{label}</span>{done ? <Badge className="rounded-full bg-emerald-100 text-emerald-700">Complete</Badge> : <Badge className="rounded-full bg-amber-100 text-amber-700">Pending</Badge>}</div>
          ))}</CardContent>
        </Card>
        <Card className="rounded-3xl"><CardHeader><CardTitle>Firm profile</CardTitle></CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <Input className="rounded-2xl" defaultValue="CLA Romania SRL" /><Input className="rounded-2xl" defaultValue="Romania" /><Input className="rounded-2xl" defaultValue="SRL (limited liability)" /><Input className="rounded-2xl" defaultValue="CLA Global" /><Input className="rounded-2xl" defaultValue="4 partners" /><Input className="rounded-2xl" defaultValue="42 staff" />
            <Textarea className="rounded-2xl lg:col-span-2 min-h-32" defaultValue="CLA Romania delivers Audit, Tax, BPS, Legal, Advisory, Transfer Pricing, Mobility, and M&A services. Registered at Green Court, Building C, 4D Gara Herastrau, 020334, Bucharest. CAFR-regulated for statutory audit. CaseWare Cloud for audit engagement files. AI Hub (24 tools) deployed March 2026." />
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
        <p className="text-slate-600 mt-3 max-w-2xl">This module follows the same design patterns as Dashboard, Risk Register, and Annual Assessment. It will be connected to the PostgreSQL backend with full CRUD, audit trail, and sign-off workflows.</p>
      </CardContent></Card>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('Dashboard');
  const pages = {
    Dashboard: <DashboardPage setPage={setPage} />,
    'Firm Setup': <FirmSetupPage />,
    'Quality System': <QualitySystemPage />,
    'Risk Register': <RiskRegisterPage />,
    'Responses & Controls': <ResponsesControlsPage />,
    Monitoring: <MonitoringPage />,
    Deficiencies: <DeficienciesPage />,
    'Annual Assessment': <AnnualAssessmentPage />,
    Documents: <DocumentsPage />,
    Admin: <AdminPage />,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar page={page} setPage={setPage} />
        <main className="flex-1 min-w-0"><TopBar /><div className="p-6 lg:p-8">{pages[page] || <DashboardPage setPage={setPage} />}</div></main>
      </div>
    </div>
  );
}
