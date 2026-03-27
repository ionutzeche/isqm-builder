import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PageGuidanceCard from '@/components/forms/PageGuidanceCard';
import FieldLabel from '@/components/forms/FieldLabel';
import HelperText from '@/components/forms/HelperText';
import CompletionChecklist from '@/components/forms/CompletionChecklist';
import ExampleCard from '@/components/forms/ExampleCard';
import ValidationBanner from '@/components/forms/ValidationBanner';
import StickyActionBar from '@/components/forms/StickyActionBar';
import api from '@/api';

export default function RiskEntry({ onBack }) {
  const [components, setComponents] = useState([]);
  const [form, setForm] = useState({ title: '', component_id: '', practice: '', owner: '', next_review_date: '', description: '', root_cause: '', inherent_likelihood: 3, inherent_impact: 3, residual_likelihood: 2, residual_impact: 2 });
  const [showValidation, setShowValidation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/api/components').then(r => setComponents(r.data)).catch(() => {}); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const checklist = [
    { label: 'Risk title', done: !!form.title },
    { label: 'ISQM component', done: !!form.component_id },
    { label: 'Affected practice', done: !!form.practice },
    { label: 'Owner', done: !!form.owner },
    { label: 'Next review date', done: !!form.next_review_date },
  ];
  const allRequired = checklist.every(c => c.done);
  const doneCount = checklist.filter(c => c.done).length;

  async function saveRisk(draft) {
    if (!draft && !allRequired) { setShowValidation(true); return; }
    setSaving(true);
    try {
      await api.post('/api/risks', {
        ...form,
        status: draft ? 'draft' : 'active',
      });
      setSaved(true);
      setTimeout(() => { if (onBack) onBack(); }, 1500);
    } catch (e) { alert(e.response?.data?.error || e.message); }
    setSaving(false);
  }

  if (saved) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="rounded-3xl border-slate-200 bg-white max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <div className="text-xl font-semibold text-slate-900 mb-2">Risk saved</div>
          <div className="text-sm text-slate-400">Returning to Risk Register...</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        {onBack && <button onClick={onBack} className="text-slate-500 hover:text-slate-900 transition text-sm">&larr; Back to Risk Register</button>}
      </div>
      <div className="text-sm text-slate-500 mb-2">Add quality risk</div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Document a quality risk</h1>
      <p className="text-slate-400 mb-6 max-w-2xl">A quality risk is something that could prevent the firm from achieving an ISQM-1 objective. Write the risk, not the control.</p>

      <PageGuidanceCard
        purpose="Document quality risks that could prevent the firm from achieving ISQM objectives."
        required="Add at least: risk title, ISQM component, affected practice, owner, and next review date."
        example="Insufficient manager review capacity in Audit during peak periods may reduce review quality and delay escalation."
        mistakes={['Writing a control instead of a risk', 'Title too vague', 'No owner assigned', 'Missing next review date']}
      />

      <ValidationBanner show={showValidation && !allRequired} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {/* REQUIRED SECTION */}
          <Card className="rounded-2xl border-slate-200 bg-white">
            <CardHeader><CardTitle className="text-slate-900 text-sm uppercase tracking-wider">Required information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <FieldLabel label="Risk title" required />
                <Input className="mt-1.5 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" placeholder="Insufficient manager review capacity in Audit during peak periods" value={form.title} onChange={e => set('title', e.target.value)} />
                <HelperText>Write one short sentence describing the risk. Be specific about where the issue occurs.</HelperText>
              </div>
              <div>
                <FieldLabel label="ISQM component" required />
                <select className="mt-1.5 w-full rounded-xl bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm" value={form.component_id} onChange={e => set('component_id', e.target.value)}>
                  <option value="">Select component...</option>
                  {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <HelperText>Select the ISQM-1 area this risk belongs to.</HelperText>
              </div>
              <div>
                <FieldLabel label="Affected practice" required />
                <select className="mt-1.5 w-full rounded-xl bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm" value={form.practice} onChange={e => set('practice', e.target.value)}>
                  <option value="">Select practice...</option>
                  <option>Audit</option><option>Tax</option><option>BPS</option><option>Advisory</option><option>Legal</option><option>Transfer Pricing</option><option>Mobility</option><option>M&A</option><option>All</option>
                </select>
                <HelperText>Choose the practice most affected by this risk.</HelperText>
              </div>
              <div>
                <FieldLabel label="Owner" required />
                <select className="mt-1.5 w-full rounded-xl bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm" value={form.owner} onChange={e => set('owner', e.target.value)}>
                  <option value="">Select owner...</option>
                  <option>Laurentiu Vasile</option><option>Alina Ene</option><option>Qasim Ranjha</option><option>Marfa Arif</option><option>Roxana Olteanu</option><option>George Chiriac</option>
                </select>
                <HelperText>The person accountable for reviewing and updating this risk.</HelperText>
              </div>
              <div>
                <FieldLabel label="Next review date" required />
                <Input type="date" className="mt-1.5 rounded-xl bg-white border-slate-200 text-slate-900" value={form.next_review_date} onChange={e => set('next_review_date', e.target.value)} />
                <HelperText>When should this risk next be formally reassessed?</HelperText>
              </div>
            </CardContent>
          </Card>

          {/* DETAILS SECTION */}
          <Card className="rounded-2xl border-slate-200 bg-white">
            <CardHeader><CardTitle className="text-slate-900 text-sm uppercase tracking-wider">Risk details</CardTitle><CardDescription className="text-slate-500">Optional but recommended for completeness.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <FieldLabel label="Description" />
                <Textarea className="mt-1.5 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-24" placeholder="During peak periods, reviewer capacity may be insufficient, increasing the risk of rushed review or delayed issue escalation." value={form.description} onChange={e => set('description', e.target.value)} />
                <HelperText>Explain what could go wrong and why it matters.</HelperText>
              </div>
              <div>
                <FieldLabel label="Root cause" />
                <Textarea className="mt-1.5 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-20" placeholder="Review responsibilities are concentrated in too few managers and partners." value={form.root_cause} onChange={e => set('root_cause', e.target.value)} />
                <HelperText>Why does this risk exist? What is the underlying driver?</HelperText>
              </div>
            </CardContent>
          </Card>

          {/* SCORING SECTION */}
          <Card className="rounded-2xl border-slate-200 bg-white">
            <CardHeader><CardTitle className="text-slate-900 text-sm uppercase tracking-wider">Risk scoring</CardTitle><CardDescription className="text-slate-500">Score 1 (lowest) to 5 (highest). Residual = after considering current responses.</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ['Inherent likelihood', 'inherent_likelihood', 'How likely before responses?'],
                  ['Inherent impact', 'inherent_impact', 'How serious before responses?'],
                  ['Residual likelihood', 'residual_likelihood', 'Likelihood after responses'],
                  ['Residual impact', 'residual_impact', 'Impact after responses'],
                ].map(([label, key, helper]) => (
                  <div key={key}>
                    <FieldLabel label={label} />
                    <select className="mt-1.5 w-full rounded-xl bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm" value={form[key]} onChange={e => set(key, parseInt(e.target.value))}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <HelperText>{helper}</HelperText>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-3 text-center">
                  <div className="text-xs text-slate-500">Inherent score</div>
                  <div className="text-2xl font-bold text-slate-900">{form.inherent_likelihood * form.inherent_impact}</div>
                </div>
                <div className="rounded-xl bg-white p-3 text-center">
                  <div className="text-xs text-slate-500">Residual score</div>
                  <div className="text-2xl font-bold text-slate-900">{form.residual_likelihood * form.residual_impact}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <CompletionChecklist items={checklist} />
          <ExampleCard title="Good risk example" fields={[
            { label: 'Title', value: 'Insufficient manager review capacity in Audit during peak periods' },
            { label: 'Component', value: 'Resources' },
            { label: 'Description', value: 'Manager review capacity may be insufficient during peak periods, creating risk of incomplete review and delayed escalation.' },
            { label: 'Root cause', value: 'Reviewer load is concentrated in too few people.' },
          ]} />
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tips for good entries</div>
            <div className="space-y-2 text-sm text-slate-500">
              <div>• Write the risk, not the control</div>
              <div>• Be specific about where the issue occurs</div>
              <div>• Keep the title short and clear</div>
              <div>• Use root cause to explain why the risk exists</div>
              <div>• Set a realistic next review date</div>
            </div>
          </div>
        </div>
      </div>

      <StickyActionBar status={`${doneCount} of ${checklist.length} required fields complete`}>
        <Button variant="outline" className="rounded-xl border-slate-200 text-slate-700" onClick={() => saveRisk(true)} disabled={saving}>Save draft</Button>
        <Button className="rounded-xl" onClick={() => saveRisk(false)} disabled={saving || !allRequired}>{saving ? 'Saving...' : 'Save risk'}</Button>
      </StickyActionBar>
    </div>
  );
}
