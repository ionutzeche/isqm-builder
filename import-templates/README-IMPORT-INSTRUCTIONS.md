# CLA Romania — ISQM-1 Import Instructions

## What has been pre-loaded

The ISQM-1 Builder already contains Version 1.0 data from:
- **8 quality objectives** (one per ISQM-1 component A-H)
- **24 quality risks** with High/Moderate ratings from the Risk Register
- **24 responses** (policy + procedure) linked to risks
- **8 monitoring activities** from the CLA Global Network Review 2025
- **4 deficiencies** from the CLA Global Review Results

## What needs to be imported (detailed data from QMH)

The files below contain the **detailed** risk matrices and objectives from the
Quality Management Handbook (EN_0.2 through EN_0.8). These expand the V1.0
summary into the full risk register.

### Step-by-step import process

1. **Log in** to isqm-builder.vercel.app
2. Go to the **Import** tab in the navigation
3. Select **"Risks"** as the import type
4. Upload `cla-romania-detailed-risks.csv`
5. Review the preview — 15 additional risks across 4 components
6. Click **Confirm import**
7. Then select **"Objectives"** and upload `cla-romania-detailed-objectives.csv`
8. Review — 27 additional objectives across 5 components
9. Click **Confirm import**

### CSV file descriptions

**cla-romania-detailed-risks.csv** (15 risks)
- Source: EN_0.5 (Engagement Performance), EN_0.6 (Resources),
  EN_0.7 (Information & Communication), EN_0.8 (Monitoring & Remediation)
- Fields: title, component, description, root_cause,
  inherent_likelihood (1-5), inherent_impact (1-5),
  residual_likelihood (1-5), residual_impact (1-5)
- All risk references (e.g. "Ref: 5.01") and response references
  (e.g. "MEP-01") are preserved in the root_cause field

**cla-romania-detailed-objectives.csv** (27 objectives)
- Source: EN_0.2 (Governance), EN_0.5 (Engagement Performance),
  EN_0.6 (Resources), EN_0.7 (Information & Communication),
  EN_0.8 (Monitoring & Remediation)
- Fields: title, component, status, description
- ISQM-1 paragraph references preserved in description field
- All set to "in_progress" status — update as work proceeds

### Still missing (to be imported when files are available)

- **EN_0.3 M3 — Relevant Ethical Requirements** (Component B detailed risks)
- **EN_0.4 M4 — Acceptance & Continuance** (Component C detailed risks)
- **EN_0.1 M1 — Risk Assessment Process** (Component H detailed risks)
- **EN_0.2 M2 — Governance & Leadership** (Component A detailed risks)
  Note: M2 was .xlsm format — macro-enabled file could not be read

When these files are available on the desktop, run the extraction again
or manually enter the risks using the Import page.

### Risk rating scale

| Rating | Probability | Impact | Score |
|--------|------------|--------|-------|
| Low    | 1          | 1      | 1     |
| Medium | 2          | 2      | 4     |
| High   | 3+         | 3+     | 9+    |

Scores from the original QMH use 1-2 scale (Romanian format).
The ISQM-1 Builder uses 1-5 scale. Mapping: 1→1, 2→2 (conservative).

### After import

1. Review all imported items in the **Risk Register** tab
2. Assign **owners** to each risk (Laurentiu, Marfa, Qasim, Alina, etc.)
3. Set **next review dates** (default: 30 June 2026)
4. Link risks to **responses** using the Responses & Controls tab
5. Update **status** as work progresses (active → mitigated)
