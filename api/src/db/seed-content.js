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
  ]
};
