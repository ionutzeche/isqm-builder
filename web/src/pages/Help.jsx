import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SECTIONS = [
  { id: 'start', title: 'Getting started', items: [
    { q: 'What is this tool?', a: 'The ISQM-1 Builder helps CLA Romania design, document, operate, and review its System of Quality Management (SoQM) as required by ISQM-1. It replaces Word documents and spreadsheets with a structured, auditable, always-current system.' },
    { q: 'Who should use it?', a: 'The audit team: Laurentiu Vasile (admin), Alina Ene, Qasim Ranjha, Marfa Arif, Roxana Olteanu, and George Chiriac. Each person is responsible for entering and maintaining data in their assigned areas.' },
    { q: 'How do I log in?', a: 'Go to isqm-builder.vercel.app. Enter your @cla.com.ro email and the temporary password (cla2026). On first login, you must set a new personal password.' },
    { q: 'What should I do first?', a: '1. Log in and change your password. 2. Go to Quality System — review the 8 ISQM components. 3. Add quality objectives for your area. 4. Go to Risk Register and add at least 3 risks. 5. Link responses from the template library.' },
  ]},
  { id: 'objectives', title: 'Quality objectives', items: [
    { q: 'What is a quality objective?', a: 'A quality objective is a goal the firm must achieve to ensure quality. Example: "Personnel fulfil responsibilities for ethical requirements including independence." Each objective belongs to one of the 8 ISQM-1 components.' },
    { q: 'How do I add one?', a: 'Go to Quality System → select a component → click "Add objective". Enter a title (required), description (recommended), and set the status (draft, in progress, or implemented).' },
    { q: 'How many do I need?', a: 'ISQM-1 does not specify a fixed number. Typically 2-4 per component. Focus on what matters for CLA Romania — not a generic checklist.' },
    { q: 'What does "implemented" mean?', a: 'The objective has working policies, procedures, and controls. The firm is actively achieving it. Mark as "in progress" if you are still building the responses.' },
  ]},
  { id: 'risks', title: 'Quality risks', items: [
    { q: 'What is a quality risk?', a: 'A quality risk is something that could prevent the firm from achieving a quality objective. It is NOT a control or an action — it is the thing that can go wrong. Example: "Insufficient manager review capacity in Audit during peak periods."' },
    { q: 'Required fields for a risk', a: 'Title (short, specific), ISQM component, affected practice, owner, and next review date. These are mandatory. Description, root cause, and scoring are optional but recommended.' },
    { q: 'How do I score a risk?', a: 'Use 1-5 for likelihood and impact. Inherent = before considering responses. Residual = after responses. Score = likelihood × impact. High (12-25), Medium (8-11), Low (1-7).' },
    { q: 'Common mistakes', a: '1. Writing a control instead of a risk ("We should review files" is a control, not a risk). 2. Title too vague ("Quality risk" means nothing). 3. No owner assigned. 4. Not setting a review date.' },
    { q: 'What is root cause?', a: 'Why does this risk exist? Example: "Review responsibilities are concentrated in too few managers and partners." This helps design better responses.' },
  ]},
  { id: 'responses', title: 'Responses & controls', items: [
    { q: 'What is a response?', a: 'A response is a policy or procedure the firm uses to address a quality risk. Example: "Cold file review programme — 3 files per quarter." Responses must be operational, not aspirational.' },
    { q: 'What is a control?', a: 'A control is a specific activity within a response. Example: "Review checklist completed and signed by reviewer." Controls can be manual or automated.' },
    { q: 'How do I link a response to a risk?', a: 'Go to Responses & Controls → add a response → then use "Link to risk" to connect it to one or more risks in the register.' },
    { q: 'Can I use templates?', a: 'Yes. Go to Responses & Controls → Templates tab. Click any template to add it as a response. Templates include: independence confirmation, EQR triggers, cold file review, AML/KYC, consultation escalation, methodology updates, CPD tracking, file assembly monitoring.' },
  ]},
  { id: 'monitoring', title: 'Monitoring & deficiencies', items: [
    { q: 'What is a monitoring activity?', a: 'An activity performed to test whether the quality system is working. Types: cold file review, walkthrough, inspection, analytics, thematic review. Log each activity with method, result, and notes.' },
    { q: 'What is a deficiency?', a: 'A deficiency is a quality issue found through monitoring or other means. It must have: title, severity (low/medium/high), root cause, owner, and a remediation plan with deadline.' },
    { q: 'How do I remediate?', a: 'For each deficiency, add remediation actions with descriptions, owners, and target dates. Mark as complete when done. The system tracks overdue items automatically.' },
    { q: 'Can I create a deficiency without monitoring?', a: 'Yes. Go to Deficiencies → Add deficiency. You can also create deficiencies from monitoring findings.' },
  ]},
  { id: 'import', title: 'Importing data', items: [
    { q: 'What can I import?', a: 'Three types: quality objectives, quality risks, and deficiencies. Each via CSV file.' },
    { q: 'How do I import?', a: '1. Go to Import tab. 2. Select the type (risks, objectives, deficiencies). 3. Download the CSV template. 4. Fill in your data following the column headers. 5. Upload the CSV. 6. Review the preview. 7. Click import.' },
    { q: 'Required columns for risks', a: 'title, component (name, e.g. "Resources"), description (optional), root_cause (optional), inherent_likelihood (1-5), inherent_impact (1-5), residual_likelihood (1-5), residual_impact (1-5).' },
    { q: 'Required columns for objectives', a: 'title, component (name), description (optional), status (draft/in_progress/implemented).' },
    { q: 'Required columns for deficiencies', a: 'title, description (optional), severity (low/medium/high), root_cause (optional), due_date (YYYY-MM-DD).' },
    { q: 'What if my file has errors?', a: 'The preview shows which rows will import and which have issues. Fix errors in your spreadsheet and re-upload. Only valid rows are imported.' },
    { q: 'Can I import from existing Word/Excel documents?', a: 'Not directly. Copy the content into the CSV template format. The template has example rows to guide you. If you have existing ISQM documentation, extract the objectives, risks, and responses into the templates and upload.' },
  ]},
  { id: 'assessment', title: 'Annual assessment', items: [
    { q: 'What is the annual assessment?', a: 'ISQM-1 requires the firm to evaluate its SoQM annually. The assessment reviews: changes in circumstances, risk status, deficiencies, response effectiveness, and concludes whether the system provides reasonable assurance.' },
    { q: 'When is our first assessment?', a: 'December 2026. The system must be populated and operational before then.' },
    { q: 'Who approves it?', a: 'The Quality Partner (Laurentiu Vasile) prepares it. The assessment requires sign-off before finalization.' },
    { q: 'What if we have unresolved high-severity deficiencies?', a: 'You can still approve, but the system will warn you. The conclusion must acknowledge open issues and include action plans.' },
  ]},
  { id: 'documents', title: 'Document generation', items: [
    { q: 'What documents can the system generate?', a: 'ISQM-1 Manual, Quality Risk Register, Responses & Controls Matrix, Monitoring Plan, Deficiency Log, Annual Assessment Report, Executive Summary.' },
    { q: 'Are they generated from the data I enter?', a: 'Yes. Documents are built from the structured data in the system — not written manually. The more complete and accurate your entries, the better the generated documents.' },
    { q: 'Can I export them?', a: 'Currently as structured data (JSON). PDF/DOCX export is planned for the next release.' },
  ]},
];

export default function Help() {
  const [activeSection, setActiveSection] = useState('start');
  const [search, setSearch] = useState('');

  const currentSection = SECTIONS.find(s => s.id === activeSection);
  const allItems = SECTIONS.flatMap(s => s.items.map(i => ({ ...i, section: s.title })));
  const filtered = search ? allItems.filter(i => (i.q + ' ' + i.a).toLowerCase().includes(search.toLowerCase())) : currentSection?.items || [];

  return (
    <div>
      <div className="text-sm text-slate-500 mb-2">Help & Tutorials</div>
      <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">How to use the ISQM-1 Builder</h1>
      <p className="text-slate-400 mb-6 max-w-2xl">Comprehensive guide for the CLA Romania audit team. Search or browse by topic.</p>

      <input className="w-full max-w-md rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm placeholder:text-slate-600 mb-6"
        placeholder="Search help topics..." value={search} onChange={e => setSearch(e.target.value)} />

      <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
        <div className="space-y-1">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => { setActiveSection(s.id); setSearch(''); }}
              className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition ${activeSection === s.id && !search ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-800'}`}>
              {s.title}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {search && <div className="text-sm text-slate-500 mb-2">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"</div>}
          {filtered.map((item, i) => (
            <Card key={i} className="rounded-2xl border-slate-700 bg-slate-900/50">
              <CardContent className="p-5">
                <div className="font-medium text-white mb-2">{item.q}</div>
                {search && item.section && <Badge className="rounded-full bg-slate-800 text-slate-400 mb-2">{item.section}</Badge>}
                <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{item.a}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
