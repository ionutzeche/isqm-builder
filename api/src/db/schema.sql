CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  jurisdiction TEXT,
  legal_structure TEXT,
  network TEXT,
  description TEXT,
  partner_count INT DEFAULT 0,
  staff_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  role TEXT CHECK (role IN ('admin','quality_partner','contributor','reviewer','viewer')) DEFAULT 'contributor',
  must_change_password BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES users(id),
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT,
  lead_partner TEXT
);

CREATE TABLE IF NOT EXISTS practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  headcount INT DEFAULT 0,
  partner_count INT DEFAULT 0,
  is_regulated BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS service_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS isqm_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INT NOT NULL
);

CREATE TABLE IF NOT EXISTS quality_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  component_id UUID REFERENCES isqm_components(id),
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quality_risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  component_id UUID REFERENCES isqm_components(id),
  practice_id UUID REFERENCES practices(id),
  objective_id UUID REFERENCES quality_objectives(id),
  title TEXT NOT NULL,
  description TEXT,
  root_cause TEXT,
  inherent_likelihood INT CHECK (inherent_likelihood BETWEEN 1 AND 5),
  inherent_impact INT CHECK (inherent_impact BETWEEN 1 AND 5),
  inherent_score INT GENERATED ALWAYS AS (inherent_likelihood * inherent_impact) STORED,
  residual_likelihood INT CHECK (residual_likelihood BETWEEN 1 AND 5),
  residual_impact INT CHECK (residual_impact BETWEEN 1 AND 5),
  residual_score INT GENERATED ALWAYS AS (residual_likelihood * residual_impact) STORED,
  owner_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('active','mitigated','archived')) DEFAULT 'active',
  next_review_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  frequency TEXT CHECK (frequency IN ('daily','weekly','monthly','quarterly','annual','ad_hoc')),
  effectiveness_status TEXT CHECK (effectiveness_status IN ('unknown','effective','ineffective')) DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_responses (
  risk_id UUID REFERENCES quality_risks(id) ON DELETE CASCADE,
  response_id UUID REFERENCES responses(id) ON DELETE CASCADE,
  PRIMARY KEY (risk_id, response_id)
);

CREATE TABLE IF NOT EXISTS controls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES responses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  control_type TEXT CHECK (control_type IN ('manual','automated')) DEFAULT 'manual',
  evidence_required TEXT,
  reviewer_id UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS monitoring_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  component_id UUID REFERENCES isqm_components(id),
  practice_id UUID REFERENCES practices(id),
  performed_by UUID REFERENCES users(id),
  performed_at DATE,
  method TEXT CHECK (method IN ('inspection','walkthrough','analytics','thematic_review','file_review')),
  result TEXT CHECK (result IN ('pass','issue_found')),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS deficiencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  component_id UUID REFERENCES isqm_components(id),
  practice_id UUID REFERENCES practices(id),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('low','medium','high')) DEFAULT 'medium',
  root_cause TEXT,
  identified_from UUID REFERENCES monitoring_activities(id),
  owner_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('open','in_progress','closed')) DEFAULT 'open',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS remediation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deficiency_id UUID REFERENCES deficiencies(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  target_date DATE,
  completed_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('open','completed','overdue')) DEFAULT 'open',
  evidence JSONB
);

CREATE TABLE IF NOT EXISTS annual_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  year INT NOT NULL,
  summary_of_changes TEXT,
  risk_summary TEXT,
  deficiency_summary TEXT,
  conclusion TEXT,
  is_effective BOOLEAN,
  status TEXT CHECK (status IN ('draft','in_review','approved')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('manual','risk_register','responses_matrix','monitoring_plan','deficiency_log','assessment_report','executive_summary')),
  version INT DEFAULT 1,
  content JSONB,
  status TEXT CHECK (status IN ('draft','approved')) DEFAULT 'draft',
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-seed ISQM-1 components
INSERT INTO isqm_components (name, description, order_index) VALUES
  ('Governance & Leadership', 'The firm''s governance structure and leadership responsibilities related to quality', 1),
  ('Relevant Ethical Requirements', 'Independence, integrity, objectivity, and other ethical requirements', 2),
  ('Acceptance & Continuance', 'Client and engagement acceptance and continuance decisions', 3),
  ('Engagement Performance', 'Quality at the engagement level including direction, supervision, and review', 4),
  ('Resources', 'Human, technological, intellectual, and financial resources for the SoQM', 5),
  ('Information & Communication', 'Information systems and communication within and outside the firm', 6),
  ('Monitoring & Remediation', 'Monitoring the SoQM and remediating identified deficiencies', 7),
  ('Risk Assessment Process', 'The firm''s process to identify and assess quality risks', 8)
ON CONFLICT DO NOTHING;
