import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/api';

export default function Import() {
  const [components, setComponents] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [type, setType] = useState('risks');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/components').then(r => setComponents(r.data)).catch(() => {});
  }, []);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim());
      if (lines.length < 2) { setError('File must have a header row and at least one data row.'); return; }
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1, 6).map(line => {
        const cells = line.split(',').map(c => c.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((h, i) => { obj[h] = cells[i] || ''; });
        return obj;
      });
      setPreview(rows);
    };
    reader.readAsText(f);
  }

  async function doImport() {
    if (!file || preview.length === 0) return;
    setError('');
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
      const items = lines.slice(1).map(line => {
        const cells = line.split(',').map(c => c.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((h, i) => { obj[h] = cells[i] || ''; });

        // Map component name to ID
        if (obj.component) {
          const comp = components.find(c => c.name.toLowerCase().includes(obj.component.toLowerCase()));
          if (comp) obj.component_id = comp.id;
        }

        // Map numeric fields
        ['inherent_likelihood', 'inherent_impact', 'residual_likelihood', 'residual_impact'].forEach(k => {
          if (obj[k]) obj[k] = parseInt(obj[k]) || 3;
        });

        return obj;
      }).filter(item => item.title);

      try {
        const { data } = await api.post('/api/import', { type, items });
        setResult(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500 mb-2">Import</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Bulk import from CSV</h1>
          <p className="text-slate-600 mt-2 max-w-3xl">Upload objectives, risks, or deficiencies from a CSV file. The system maps columns to fields automatically.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Upload CSV</CardTitle>
              <CardDescription>Select the type of data, then upload your file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                {['risks', 'objectives', 'deficiencies'].map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${type === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-slate-400 transition"
                onClick={() => document.getElementById('csvInput').click()}>
                <input id="csvInput" type="file" accept=".csv" className="hidden" onChange={handleFile} />
                <div className="text-2xl mb-2">&#8679;</div>
                <div className="font-medium text-slate-700">{file ? file.name : 'Drop CSV file here or click to browse'}</div>
                <div className="text-sm text-slate-500 mt-1">{file ? `${Math.round(file.size / 1024)} KB` : 'UTF-8 encoded, comma-separated'}</div>
              </div>

              {preview.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">Preview (first {preview.length} rows)</div>
                  <div className="overflow-x-auto rounded-xl border">
                    <Table>
                      <TableHeader><TableRow>{Object.keys(preview[0]).map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                      <TableBody>{preview.map((row, i) => (
                        <TableRow key={i}>{Object.values(row).map((v, j) => <TableCell key={j} className="text-xs">{v}</TableCell>)}</TableRow>
                      ))}</TableBody>
                    </Table>
                  </div>
                  <Button className="rounded-2xl mt-4" onClick={doImport}>Import {preview.length}+ {type}</Button>
                </div>
              )}

              {error && <div className="text-sm text-rose-600 bg-rose-50 rounded-xl p-3">{error}</div>}
              {result && <div className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3">Imported {result.imported} {result.type} successfully.</div>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="text-sm">Required CSV format</CardTitle></CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-4">
              <div>
                <div className="font-medium text-slate-900 mb-1">Risks CSV columns:</div>
                <code className="block bg-slate-50 rounded-lg p-2 leading-relaxed">title, description, component, root_cause, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact</code>
                <div className="mt-1 text-slate-500">Component = name (e.g. "Resources"). Likelihood/impact = 1-5.</div>
              </div>
              <div>
                <div className="font-medium text-slate-900 mb-1">Objectives CSV columns:</div>
                <code className="block bg-slate-50 rounded-lg p-2 leading-relaxed">title, description, component, status</code>
                <div className="mt-1 text-slate-500">Status = draft, in_progress, or implemented.</div>
              </div>
              <div>
                <div className="font-medium text-slate-900 mb-1">Deficiencies CSV columns:</div>
                <code className="block bg-slate-50 rounded-lg p-2 leading-relaxed">title, description, severity, root_cause, due_date</code>
                <div className="mt-1 text-slate-500">Severity = low, medium, or high. Date = YYYY-MM-DD.</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="text-sm">Download templates</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {['risks', 'objectives', 'deficiencies'].map(t => (
                <button key={t} className="w-full rounded-2xl border p-3 text-left text-sm hover:bg-slate-50 transition"
                  onClick={() => {
                    const templates = {
                      risks: 'title,description,component,root_cause,inherent_likelihood,inherent_impact,residual_likelihood,residual_impact\n"Example risk","Description here","Resources","Root cause",4,4,2,3',
                      objectives: 'title,description,component,status\n"Example objective","Description","Governance & Leadership","draft"',
                      deficiencies: 'title,description,severity,root_cause,due_date\n"Example deficiency","Description","medium","Root cause","2026-06-30"'
                    };
                    const blob = new Blob([templates[t]], { type: 'text/csv' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `isqm-${t}-template.csv`;
                    a.click();
                  }}>
                  <div className="font-medium">{t.charAt(0).toUpperCase() + t.slice(1)} template</div>
                  <div className="text-xs text-slate-500">Download CSV template with headers and example row</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
