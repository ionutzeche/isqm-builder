# CLA Romania — ISQM-1 Complete Import Package

## Pre-loaded in database (Version 1.0 summary)
- 8 quality objectives (one per component A-H)
- 24 quality risks (3 per component, High/Moderate ratings)
- 24 responses linked to risks
- 8 monitoring activities (CLA Global Review 2025)
- 4 deficiencies with remediation plans

## Full QMH data ready to import

### cla-romania-all-risks.csv — 175 risks
All quality risks from the Quality Management Handbook (EN_0.1 through EN_0.8):
- **Component A (Governance & Leadership):** ~15 risks
- **Component B (Relevant Ethical Requirements):** ~20 risks
- **Component C (Acceptance & Continuance):** ~15 risks
- **Component D (Engagement Performance):** ~20 risks
- **Component E (Resources):** ~27 risks
- **Component F (Information & Communication):** ~18 risks
- **Component G (Monitoring & Remediation):** ~17 risks
- **Component H (Risk Assessment Process):** ~15 risks

Each risk includes: title, component, description (rationale), root_cause
(with QMH reference numbers and linked objectives/responses),
inherent likelihood/impact, residual likelihood/impact.

### cla-romania-all-objectives.csv — 63 objectives
All quality objectives across 8 components:
- Governance (5), Ethics (5+), Acceptance (5+), Engagement (6),
  Resources (5), Information (6), Monitoring (6), Risk Assessment (5+)

Each objective includes: title, component, status (in_progress),
description (with ISQM-1 paragraph references and risk references).

## How to import

### Step 1 — Log in
Go to https://isqm-builder.vercel.app
Login: your @cla.com.ro email / password

### Step 2 — Import risks
1. Click **Import** in the left navigation
2. Select **Risks** as the import type
3. Click **Download Risks template** to see the format (or use cla-romania-all-risks.csv directly)
4. Upload **cla-romania-all-risks.csv**
5. Review the preview — you should see 175 rows
6. Click **Confirm import**

### Step 3 — Import objectives
1. Select **Objectives** as the import type
2. Upload **cla-romania-all-objectives.csv**
3. Review — 63 rows
4. Click **Confirm import**

### Step 4 — After import
1. Go to **Risk Register** — review all 199 risks (24 pre-loaded + 175 imported)
2. **Assign owners** to each risk per the ISQM role assignments:
   - Laurentiu Vasile (UR): Components A, C, D, H
   - Marfa Arif (OR): Components E, F
   - Qasim Ranjha (IND): Component B
   - Alina Ene (MON): Component G
3. Set **next review dates** (suggested: 30 June 2026)
4. Go to **Quality System** — review the 71 objectives (8 + 63)
5. Update status as work progresses: draft → in_progress → implemented

## Risk rating scale mapping
The original QMH uses a 1-2 scale. The Builder uses 1-5.
Mapping applied: QMH 1 → Builder 1, QMH 2 → Builder 2.
Risks rated 2x2 in QMH appear as score 4 (Medium) in the Builder.

## Source files
- EN_0.1 M1 — Risk Assessment Process (Component H)
- EN_0.2 M2 — Governance and Leadership (Component A)
- EN_0.3 M3 — Relevant Ethical Requirements (Component B)
- EN_0.4 M4 — Acceptance and Continuity (Component C)
- EN_0.5 M5 — Engagement Performance (Component D)
- EN_0.6 M6 — Resources (Component E)
- EN_0.7 M7 — Information and Communication (Component F)
- EN_0.8 M8 — Monitoring and Remediation (Component G)

## Questions?
Contact the audit team or use the Feedback Hub at app.cla.com.ro/feedback/
