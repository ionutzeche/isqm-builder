// ISQM-1 V1.0 Design Documentation — CLA Romania
// Source: ISQM1_SQM_Design_v1.0.xlsx + Word document V1.0 March 2026

module.exports = {
  firmProfile: {
    name: 'CLA Romania',
    jurisdiction: 'Romania',
    legal_structure: 'SRL',
    network: 'CLA Global',
    description: 'Services: Statutory audit, Review engagements, Agreed-upon procedures, Tax, Advisory, Accounting, Payroll. Engagement types: Statutory audit (PIE and non-PIE), Review engagements, AUP, Cross-border / German Audit Desk. Regulatory body: CAFR. PIE/listed clients: Limited — assessed per engagement. Staff: ~40 professional staff. Monitoring cycle: Annual — first cycle Q1 2026. Standard: ISQM 1 (IAASB). Document version: 1.0 — March 2026. Sprint 2: April 2026.',
    partner_count: 4,
    staff_count: 40
  },

  roles: [
    { email: 'ionut.zeche@cla.com.ro', name: 'Ionut Zeche', role: 'admin', isqmCode: null, isqmRole: null },
    { email: 'laurentiu.vasile@cla.com.ro', name: 'Laurentiu Vasile', role: 'admin', isqmCode: 'UR', isqmRole: 'Ultimately Responsible Individual — ultimate accountability for the SQM. Final sign-off on Design, annual evaluation, and overall governance. ISQM 1 para. 27. Leads: Governance & Leadership (A), Engagement Performance (D), Acceptance & Continuance (C).' },
    { email: 'marfa.arif@cla.com.ro', name: 'Marfa Arif', role: 'contributor', isqmCode: 'OR', isqmRole: 'Operationally Responsible Individual — day-to-day operational responsibility for running and maintaining the SQM across all components. Drives task completion and system upkeep. Leads: Resources (E), Information & Communication (F).' },
    { email: 'qasim.ranjha@cla.com.ro', name: 'Qasim Ranjha', role: 'contributor', isqmCode: 'IND', isqmRole: 'Independence Responsibility — operationally responsible for independence policies, conflict checks, and annual independence declarations. ISQM 1 para. 29(b). Leads: Relevant Ethical Requirements (B). Also: Acceptance & Continuance (C) conflict checks.' },
    { email: 'alina.ene@cla.com.ro', name: 'Alina Ene', role: 'contributor', isqmCode: 'MON', isqmRole: 'Monitoring Responsibility — operationally responsible for monitoring programme, quality findings tracking, and remediation management. ISQM 1 para. 49-54. Leads: Monitoring & Remediation (G). Oversight of monitoring across all components.' },
    { email: 'roxana.olteanu@cla.com.ro', name: 'Roxana Olteanu', role: 'contributor', isqmCode: null, isqmRole: null },
    { email: 'george.chiriac@cla.com.ro', name: 'George Chiriac', role: 'contributor', isqmCode: null, isqmRole: null },
  ],

  riskScale: { High: { l: 4, i: 4 }, Moderate: { l: 3, i: 3 }, Low: { l: 2, i: 2 } },

  components: [
    { code: 'A', name: 'Governance & Leadership', order: 1,
      objective: 'Leadership establishes and promotes a culture where quality is recognized as essential in performing engagements and assigns ultimate responsibility for the system of quality management.',
      ownerEmail: 'laurentiu.vasile@cla.com.ro',
      risks: [
        { text: 'Leadership messaging prioritizes commercial performance over engagement quality.', rating: 'High', policy: 'The Managing Partner holds ultimate responsibility for quality.', procedure: 'Annual leadership communication regarding quality priorities.', cwRef: 'Link to Governance & Leadership policy document' },
        { text: 'Responsibilities for quality management are not clearly defined.', rating: 'High', policy: 'Formal assignment of SQM roles (UR, OR, IND, MON).', procedure: 'Formal assignment of SQM roles within CaseWare SQM.', cwRef: 'Link to Roles & Responsibilities matrix' },
        { text: 'Insufficient oversight by leadership of the operation of the SQM.', rating: 'Moderate', policy: 'Leadership regularly communicates the importance of quality to all personnel.', procedure: 'Quarterly review of quality indicators by firm leadership.', cwRef: 'Link to quality indicator dashboard' },
      ]},
    { code: 'B', name: 'Relevant Ethical Requirements', order: 2,
      objective: 'Personnel comply with relevant ethical requirements, including independence requirements.',
      ownerEmail: 'qasim.ranjha@cla.com.ro',
      risks: [
        { text: 'Personnel do not fully understand independence requirements.', rating: 'High', policy: 'Personnel must comply with the IESBA Code of Ethics and applicable professional standards.', procedure: 'Independence training during onboarding and annually thereafter.', cwRef: 'Link to independence training record' },
        { text: 'Independence breaches are not identified promptly.', rating: 'High', policy: 'Independence breaches must be reported immediately.', procedure: 'Maintenance of an independence breach register.', cwRef: 'Link to breach register' },
        { text: 'Monitoring of financial relationships is incomplete.', rating: 'Moderate', policy: 'Annual independence confirmations are required.', procedure: 'Annual independence declarations by all professional staff.', cwRef: 'Link to independence declaration forms' },
      ]},
    { code: 'C', name: 'Acceptance & Continuance', order: 3,
      objective: 'The firm accepts or continues only those client relationships and engagements where it can perform the engagement with competence and integrity.',
      ownerEmail: 'laurentiu.vasile@cla.com.ro',
      risks: [
        { text: 'Engagements accepted without adequate risk assessment.', rating: 'High', policy: 'All engagements require a formal acceptance assessment.', procedure: 'Completion of acceptance and continuance forms.', cwRef: 'Link to A&C procedure — Form 405 CaseWare Cloud' },
        { text: 'Insufficient background checks of client management.', rating: 'Moderate', policy: 'Continuance decisions must consider client integrity and independence.', procedure: 'Client integrity and background checks.', cwRef: 'Link to AML/KYC procedure' },
        { text: 'Pressure to retain high-risk clients due to commercial considerations.', rating: 'High', policy: 'High-risk engagements require escalation to leadership.', procedure: 'Annual reassessment of existing engagements.', cwRef: 'Link to International & Sensitive Client Policy' },
      ]},
    { code: 'D', name: 'Engagement Performance', order: 4,
      objective: 'Engagements are performed in accordance with professional standards and applicable regulatory requirements.',
      ownerEmail: 'laurentiu.vasile@cla.com.ro',
      risks: [
        { text: 'Engagement teams do not consistently apply firm methodology.', rating: 'High', policy: 'Engagement teams must follow the firm\'s approved audit methodology.', procedure: 'Engagement planning documentation before fieldwork begins.', cwRef: 'Link to CaseWare Cloud methodology' },
        { text: 'Inadequate supervision of engagement teams.', rating: 'High', policy: 'Engagement Partner retains responsibility for engagement quality.', procedure: 'Partner review of key audit areas and significant judgments.', cwRef: 'Link to review procedures' },
        { text: 'Failure to consult on complex technical matters.', rating: 'Moderate', policy: 'Mandatory consultation for complex accounting or auditing issues.', procedure: 'Documentation retention in accordance with firm policy.', cwRef: 'Link to technical consultation log' },
      ]},
    { code: 'E', name: 'Resources', order: 5,
      objective: 'The firm maintains sufficient and appropriate resources to perform engagements.',
      ownerEmail: 'marfa.arif@cla.com.ro',
      risks: [
        { text: 'Insufficient staffing or experience for complex engagements.', rating: 'High', policy: 'Engagement teams must have appropriate competence and capacity.', procedure: 'Resource allocation planning before engagements.', cwRef: 'Link to resource planning template' },
        { text: 'Inadequate training for evolving regulatory requirements.', rating: 'Moderate', policy: 'Personnel participate in continuous professional development.', procedure: 'Annual training plans for professional staff.', cwRef: 'Link to CPD tracking register' },
        { text: 'Over-reliance on key individuals.', rating: 'Moderate', policy: 'Technology and methodology resources support engagement quality.', procedure: 'Monitoring of staff workload and utilization.', cwRef: 'Link to utilization report' },
      ]},
    { code: 'F', name: 'Information & Communication', order: 6,
      objective: 'Relevant information regarding the SQM is communicated effectively throughout the firm.',
      ownerEmail: 'marfa.arif@cla.com.ro',
      risks: [
        { text: 'Personnel do not understand quality policies or procedures.', rating: 'Moderate', policy: 'Quality policies are documented and accessible to all personnel.', procedure: 'Publication of policies on internal knowledge platforms (SharePoint).', cwRef: 'Link to SharePoint policy library' },
        { text: 'Communication between leadership and engagement teams is inconsistent.', rating: 'Moderate', policy: 'Leadership communicates updates to policies promptly.', procedure: 'Periodic quality communications to all staff.', cwRef: 'Link to communication log' },
        { text: 'Quality concerns are not escalated appropriately.', rating: 'High', policy: 'Personnel are encouraged to raise quality concerns.', procedure: 'Escalation process for quality concerns.', cwRef: 'Link to escalation procedure' },
      ]},
    { code: 'G', name: 'Monitoring & Remediation', order: 7,
      objective: 'The firm monitors the system of quality management and remediates deficiencies on a timely basis.',
      ownerEmail: 'alina.ene@cla.com.ro',
      risks: [
        { text: 'Quality deficiencies are not detected promptly.', rating: 'High', policy: 'Monitoring activities are performed annually.', procedure: 'Internal inspections of selected engagements.', cwRef: 'Link to monitoring plan' },
        { text: 'Monitoring activities are not sufficiently independent.', rating: 'Moderate', policy: 'Identified deficiencies are documented and assessed.', procedure: 'Documentation of monitoring results.', cwRef: 'Link to monitoring results log' },
        { text: 'Remediation actions are not implemented.', rating: 'High', policy: 'Remediation plans are developed and tracked.', procedure: 'Follow-up on remediation actions.', cwRef: 'Link to remediation tracker' },
      ]},
    { code: 'H', name: 'Risk Assessment Process', order: 8,
      objective: 'The firm identifies and assesses quality risks to design and implement appropriate responses.',
      ownerEmail: 'laurentiu.vasile@cla.com.ro',
      risks: [
        { text: 'Quality risks are not identified systematically.', rating: 'High', policy: 'The firm performs a structured risk assessment process.', procedure: 'Identification of risks linked to each ISQM-1 component.', cwRef: 'CaseWare SQM Risk Assessment module' },
        { text: 'Responses are not aligned with identified risks.', rating: 'Moderate', policy: 'Quality objectives, risks, and responses are documented in CaseWare SQM.', procedure: 'Documentation of risk ratings.', cwRef: 'CaseWare SQM response linkage' },
        { text: 'Risk assessments are not updated regularly.', rating: 'Moderate', policy: 'The risk assessment process is reviewed annually.', procedure: 'Periodic review of the risk assessment.', cwRef: 'Annual SQM review calendar' },
      ]},
  ],

  // CLA Global Network Review — September 2025
  monitoringActivities: [
    { title: 'CLA Global Network Monitoring Review 2025', method: 'inspection', result: 'issue_found', notes: 'Period under review: 2025 (assurance: audits performed in 2025 for FY 2024). Reviewer: Porubcanova. Date: 10 Sep 2025. Overall: Pass with deficiencies in Risk Management, Audit, and Tax.' },
    { title: 'Audit file review — AMANN Romania SRL', method: 'file_review', result: 'issue_found', notes: 'CLA Global review of AMANN Romania audit file. Finding: Files not closed within 60 days (CaseWare Cloud technical issues). Lock-down deadline missed.' },
    { title: 'Audit file review — SOMEG Gherla SA', method: 'file_review', result: 'pass', notes: 'CLA Global review of SOMEG Gherla audit file. No significant issues identified.' },
    { title: 'Tax advisory file review — Elemental', method: 'file_review', result: 'issue_found', notes: 'CLA Global review. Finding: Some delays in onboarding procedures. Insufficient supervision noted.' },
    { title: 'Tax advisory file review — Adeplast', method: 'file_review', result: 'pass', notes: 'CLA Global review. No significant issues.' },
    { title: 'Cybersecurity review', method: 'inspection', result: 'pass', notes: 'CLA Global cybersecurity review 2025. Pass — no deficiencies identified.' },
    { title: 'Independence review', method: 'inspection', result: 'pass', notes: 'Independence declarations and conflict checks reviewed. No breaches identified.' },
    { title: 'SoQM Design review', method: 'inspection', result: 'issue_found', notes: 'QMH obtained (Version 1.0 from 01.07.2024). Quality objectives and risk matrices present. Finding: evaluation of SoQM effectiveness not performed in 2025 prior to CLA Global monitoring.' },
  ],

  // Deficiencies from CLA Global Review Results
  deficiencies: [
    { title: 'No evaluation of the system of quality management performed in 2025', severity: 'high', component: 'G', root_cause: 'ISQM-1 implemented July 2024 (late start vs 15.12.2022 standard). Design and implementation completed but effectiveness evaluation not yet performed before CLA Global monitoring visit.', remediation: 'Implement the quality evaluation system (internal monitoring process). First annual evaluation by December 2026.', due: '2026-12-31', source: 'CLA Global Network Review 2025 — Risk Management', status: 'open' },
    { title: 'Audit files not closed within 60 days in CaseWare Cloud', severity: 'high', component: 'D', root_cause: 'Technical issues with CaseWare Cloud version. FY 2024 audit files not locked down within 60-day assembly deadline.', remediation: 'Implement closing of audit files within 60 days. Resolve CaseWare Cloud technical issues. Track file assembly deadlines in Audit Planner.', due: '2026-06-30', source: 'CLA Global Network Review 2025 — Audit & Assurance', status: 'in_progress' },
    { title: 'Tax engagement onboarding delays and insufficient supervision', severity: 'medium', component: 'C', root_cause: 'Onboarding documentation for existing clients may be dated with some delays due to the transition period. Tax work not consistently reviewed by second person.', remediation: 'Early onboarding procedures for all clients. Setup at least 4-eye review system for each tax engagement (even if partner or manager performs the work).', due: '2026-06-30', source: 'CLA Global Network Review 2025 — Tax & Advisory', status: 'open' },
    { title: 'ISQM-1 implementation delayed — started July 2024 vs December 2022 requirement', severity: 'medium', component: 'H', root_cause: 'New implementation for the whole firm (all business lines) after network adherence. Significant effort required to build from scratch.', remediation: 'Complete Design phase in CaseWare SQM by 31 March 2026. Sprint 2 calibration April 2026. First annual evaluation December 2026.', due: '2026-03-31', source: 'CLA Global Network Review 2025 — Key Business Changes', status: 'in_progress' },
  ],

  // Sprint tasks from ISQM1_Tracker_Updated_9Mar2026.xlsx
  // HR Policy Manual evidence references — Component E (Resources) and Component A (Governance)
  hrManualEvidence: {
    source: 'Manual de Politici de Resurse Umane — Versiunea Aprilie 2025',
    approved_by: 'Ana Tifigiu (Group HR Manager) + Ionut Zeche (reviewer)',
    sections: [
      { ref: 'Section 7', title: 'Planificarea Resurselor Umane', isqmComponent: 'E', relevance: 'Workforce planning, role classification, salary grids, career trajectories — supports ISQM-1 objective 6a (personnel competence) and risk 6.02 (timely hiring)' },
      { ref: 'Section 9', title: 'Recrutare și Selecție', isqmComponent: 'E', relevance: 'Recruitment approval process, interview standards, offer approval — supports risk 6.01 (qualified candidates)' },
      { ref: 'Section 10-11', title: 'Pre-angajare + Inducția Noilor Angajați', isqmComponent: 'E', relevance: 'Onboarding procedure, IT induction, Jurnal Gold training, client induction plan, entry checklist — supports risk 6.03 (adequate skills)' },
      { ref: 'Section 12', title: 'Evaluarea Performanței', isqmComponent: 'E', relevance: 'Annual KPI evaluation, 360-degree feedback — supports ISQM-1 objective 6b (quality commitment through actions)' },
      { ref: 'Section 13', title: 'Talent Management și Succession Planning', isqmComponent: 'E', relevance: 'Succession planning, 9-box matrix, leader development — supports risk 6.05 (intellectual capital loss)' },
      { ref: 'Section 15', title: 'Formarea Profesională (CPD)', isqmComponent: 'E', relevance: 'Professional training programs — supports ISQM-1 objective 6c (competence development) and risk 6.14 (inadequate training)' },
      { ref: 'Section 3 + Annex 3', title: 'Cod de Conduită și Etică', isqmComponent: 'B', relevance: 'Code of conduct and business ethics — supports Component B (Ethical Requirements) objective' },
      { ref: 'Section 4 + Annex 4', title: 'Whistleblowing', isqmComponent: 'F', relevance: 'Reporting procedure for quality concerns — supports Component F (Information & Communication) escalation process' },
      { ref: 'Section 16', title: 'Procedura Disciplinară', isqmComponent: 'A', relevance: 'Disciplinary procedure — supports Component A (Governance) accountability framework' },
      { ref: 'Annex 23', title: 'Analiză deficit de competențe', isqmComponent: 'E', relevance: 'Skills gap analysis template — supports risk 6.13 (competence gaps) and objective 6c' },
      { ref: 'Annex 39', title: 'Grilă evaluare potențial, Matrice 9-box', isqmComponent: 'E', relevance: '9-box potential/performance matrix + leader development plan — supports succession planning' },
      { ref: 'GDPR Section', title: 'Protecția datelor cu caracter personal', isqmComponent: 'F', relevance: 'Data protection policy — supports Component F information security controls' },
    ]
  },

  // Security Incident Management Procedure — supports Component F + cybersecurity
  // Operational forms and registers — direct ISQM-1 evidence documents (Desktop/new folder)
  operationalForms: [
    { ref: '1.1', name: 'Annual Independence Statement Form', component: 'B', type: 'form', description: 'Annual independence declarations — staff confirm compliance with independence requirements. Signed by all professional staff.' },
    { ref: '1.2', name: 'Confidentiality Statement', component: 'B', type: 'form', description: 'Confidentiality statement signed by all personnel. Covers client data, engagement information, and firm intellectual property.' },
    { ref: '1.3', name: 'Induction — New Employee Form', component: 'E', type: 'checklist', description: 'New employee induction form — onboarding checklist and sign-off. Covers IT setup, system training, policy review, team introduction.' },
    { ref: '1.7', name: 'Rejected Clients Register', component: 'C', type: 'register', description: 'Register of declined engagements with reasons for rejection. Supports acceptance & continuance process audit trail.' },
    { ref: '1.11.1', name: 'Background Check Form — Individuals', component: 'C', type: 'form', description: 'Background check form for individual clients — AML/KYC due diligence. PEP screening, beneficial ownership, risk classification.' },
    { ref: '1.11.2', name: 'Background Check Form — Legal Entities', component: 'C', type: 'form', description: 'Background check form for legal entity clients — AML/KYC due diligence. Corporate structure, UBO identification, sanctions screening.' },
    { ref: '1.14', name: 'Off-Boarding Checklist', component: 'E', type: 'checklist', description: 'Off-boarding checklist — knowledge transfer, access revocation, equipment return, exit interview. Supports succession planning.' },
    { ref: '1.15', name: 'Interests Register and Business Affairs', component: 'B', type: 'register', description: 'Register of personal interests, business relationships, and potential conflicts. Updated annually and on trigger events.' },
    { ref: '1.16', name: 'Consultation Register', component: 'D', type: 'register', description: 'Log of complex technical consultations — accounting, auditing, regulatory matters. Records question, participants, conclusion, implementation.' },
    { ref: '1.17', name: 'Client Complaints Investigation Form', component: 'F', type: 'form', description: 'Structured investigation form for client complaints. Captures complaint, investigation steps, findings, resolution, follow-up.' },
    { ref: '1.18', name: 'Complaints Register', component: 'F', type: 'register', description: 'Central register tracking all client and internal complaints. Status, severity, resolution, lessons learned.' },
    { ref: '1.21', name: 'Mission Valuation Form', component: 'C', type: 'form', description: 'Engagement/mission valuation and risk assessment form. Used during acceptance to evaluate engagement risk, resource requirements, fee adequacy.' },
    { ref: '1.23', name: 'Training Course Valuation Form', component: 'E', type: 'form', description: 'Training course evaluation form — participants rate quality, relevance, and applicability. Supports CPD tracking and training quality monitoring.' },
  ],

  // Policies and IT procedures from Desktop/new 2 folder
  policies: [
    { ref: '1.5', name: 'Politica privind onorariile contingente', component: 'C', description: 'Contingent fee policy — rules on accepting engagements with contingent fees. Supports engagement acceptance risk assessment.' },
    { ref: '1.6', name: 'Proceduri in cazul nerespectarii legilor de catre clienti', component: 'C', description: 'Procedures when clients breach laws — reporting obligations, engagement continuance decisions, regulatory notification.' },
    { ref: '1.8', name: 'Politica privind verificarea relatiilor cu clienti internationali', component: 'C', description: 'International client verification policy — due diligence for cross-border clients. Supports CLA Global network compliance.' },
    { ref: '1.9', name: 'Politica privind verificarea antecedentelor clientilor', component: 'C', description: 'Client background check policy — AML/KYC procedure framework. Links to Background Check Forms 1.11.1 and 1.11.2.' },
    { ref: '1.10', name: 'Politica privind obtinerea informatiilor necesare de la clienti', component: 'C', description: 'Policy on obtaining necessary client information — data requirements for engagement acceptance and continuance.' },
    { ref: '1.13', name: 'Politica privind incetarea relatiilor cu clientii', component: 'C', description: 'Client relationship termination policy — criteria, process, documentation for discontinuing client relationships.' },
    { ref: '1.19', name: 'Politica denuntare interna a neregulilor (whistleblowing)', component: 'F', description: 'Internal whistleblowing policy — anonymous reporting channels, protection, investigation process. Supports quality concern escalation.' },
    { ref: '1.22', name: 'Politica privind gestionarea situatiilor de criza', component: 'A', description: 'Crisis management policy — leadership response protocols, communication, business continuity. Supports governance oversight.' },
  ],
  itPolicies: [
    { ref: '1.4.1', name: 'Procedura de administrare a documentelor', component: 'F', description: 'Document administration procedure — version control, access, retention, disposal. Supports information management controls.' },
    { ref: '1.4.2', name: 'Procedura de management al incidentelor de securitate', component: 'F', description: 'Security incident management — ticketing, analysis, resolution, periodic review. Incident reporting via BSD IT department.' },
    { ref: '1.4.3', name: 'Procedura de management al vulnerabilitatilor de securitate', component: 'F', description: 'Security vulnerability management — scanning, assessment, patching, risk acceptance. Supports technology resource controls.' },
    { ref: '1.4.4', name: 'Procedura privind administrarea parolelor', component: 'F', description: 'Password administration procedure — complexity, rotation, MFA requirements. Protects engagement and client data.' },
    { ref: '1.4.5', name: 'Procedura privind casarea echipamentelor', component: 'E', description: 'Equipment disposal procedure — secure data wiping, hardware decommissioning. Prevents data leakage from retired assets.' },
    { ref: '1.4.6', name: 'Procedura privind filtrarea traficului si accesul in internet', component: 'F', description: 'Internet traffic filtering and access control — web filtering, restricted sites, monitoring. Protects firm infrastructure.' },
    { ref: '1.4.7', name: 'Procedura privind gestionarea actualizarilor si patch-urilor', component: 'F', description: 'Patch management procedure — update scheduling, testing, deployment. Keeps systems secure and operational.' },
    { ref: '1.4.8', name: 'Procedura privind utilizarea suportilor de memorie externa', component: 'F', description: 'External storage device policy — USB restrictions, encryption requirements, approved devices. Prevents unauthorized data transfer.' },
  ],

  securityProcedure: {
    source: 'Procedura de management al incidentelor de securitate a informatiei — UPDATED',
    isqmComponents: ['F', 'E'],
    relevance: 'Incident reporting via ticketing system (BSD), analysis and resolution process, periodic review, roles (IT dept, employees, dept managers, Group leadership). Supports Component F (Information & Communication) information security controls and Component E (Resources) technology resources. Referenced by: Politica de securitate a informatiilor, Procedura de administrare a documentelor.',
  },

  sprintTasks: [
    { task: 'CLIENT ACCEPTANCE / CONTINUANCE & AML PROCEDURE UPDATE', priority: 'P0', responsible: 'Diana (Corporate)', deadline: '2026-03-09', status: 'Complete', deliverable: 'Integrated CA procedure + ISQM-1 redline (pp.61-75)', notes: 'Diana delivered: (a) Narrative Client Acceptance Procedure (integrated with InScope AML) and (b) Client Acceptance Map.' },
    { task: 'AUDIT PROCESS DESCRIPTION UPDATE — CASEWARE CLOUD', priority: 'P0', responsible: 'Laurentiu & Alina', deadline: '2026-03-09', status: 'Complete', deliverable: 'Updated process docs + ISQM-1 audit sections + WP templates', notes: 'All subtasks completed. CaseWare Desktop references replaced with Cloud workflows.' },
    { task: 'Update ISQM-1 Manual audit sections with Cloud references', priority: 'P1', responsible: 'Laurentiu', deadline: '2026-03-08', status: 'Complete', deliverable: 'ISQM-1 redline (audit sections)', notes: 'Completed. Manual updated with CaseWare Cloud references.' },
    { task: 'Update working paper templates for CaseWare Cloud', priority: 'P1', responsible: 'Marfa / Qasim', deadline: '2026-03-08', status: 'Complete', deliverable: 'Updated WP templates', notes: 'Templates updated to reflect Cloud structure.' },
    { task: 'Update Audit Process Diagram for CaseWare Cloud', priority: 'P1', responsible: 'Bogdan', deadline: '2026-03-08', status: 'Complete', deliverable: 'Updated Audit Diagram', notes: 'New task added 5 Mar. Diagram updated.' },
    { task: 'Publish ISQM-1 V1.0 Design in CaseWare SQM', priority: 'P0', responsible: 'Marfa Arif', deadline: '2026-03-31', status: 'In progress', deliverable: 'CaseWare SQM Design published', notes: 'Sprint target. All component content ready. Entry into CaseWare SQM in progress.' },
    { task: 'Sprint 2: Refine risk definitions for CLA Romania specifics', priority: 'P1', responsible: 'Laurentiu / Marfa', deadline: '2026-04-30', status: 'Not started', deliverable: 'Updated risk descriptions', notes: 'Update risk descriptions to reflect CLA Romania-specific engagement types, client portfolio, and team structure.' },
    { task: 'Sprint 2: Align policies with CLA Romania procedures', priority: 'P1', responsible: 'Marfa / Qasim', deadline: '2026-04-30', status: 'Not started', deliverable: 'Cross-referenced policies', notes: 'Cross-reference existing CLA Romania Manual sections, SharePoint procedures, and CLA Global policies.' },
    { task: 'Sprint 2: Integrate engagement quality indicators', priority: 'P1', responsible: 'Alina Ene', deadline: '2026-04-30', status: 'Not started', deliverable: 'Quality indicators per component', notes: 'Define measurable quality indicators per component linked to CaseWare Cloud engagement data.' },
    { task: 'Sprint 2: Implement monitoring dashboards in CaseWare', priority: 'P1', responsible: 'Alina Ene', deadline: '2026-04-30', status: 'Not started', deliverable: 'CaseWare Operate monitoring', notes: 'Configure monitoring activities in CaseWare Operate module; assign monitoring tasks to MON role.' },
    { task: 'Sprint 2: German Audit Desk alignment', priority: 'P2', responsible: 'Laurentiu', deadline: '2026-04-30', status: 'Not started', deliverable: 'Extended Component C and D responses', notes: 'Extend Component C and D responses to cover cross-border engagement specifics with dhpg / Oliver Renken.' },
  ]
};
