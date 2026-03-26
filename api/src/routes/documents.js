const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT id, type, version, status, approved_by, created_at FROM documents WHERE organization_id=$1 ORDER BY created_at DESC',
      [req.user.organization_id]);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/generate', auth, async (req, res) => {
  const { type } = req.body;
  if (!type) return res.status(400).json({ error: 'type required' });
  try {
    const orgId = req.user.organization_id;
    let content = {};

    if (type === 'risk_register') {
      const risks = await pool.query('SELECT * FROM quality_risks WHERE organization_id=$1 ORDER BY residual_score DESC NULLS LAST', [orgId]);
      content = { risks: risks.rows, generated_at: new Date().toISOString() };
    } else if (type === 'deficiency_log') {
      const defs = await pool.query('SELECT * FROM deficiencies WHERE organization_id=$1 ORDER BY severity, created_at DESC', [orgId]);
      content = { deficiencies: defs.rows, generated_at: new Date().toISOString() };
    } else if (type === 'assessment_report') {
      const assessment = await pool.query('SELECT * FROM annual_assessments WHERE organization_id=$1 ORDER BY year DESC LIMIT 1', [orgId]);
      content = { assessment: assessment.rows[0] || null, generated_at: new Date().toISOString() };
    } else if (type === 'manual') {
      const org = await pool.query('SELECT * FROM organizations WHERE id=$1', [orgId]);
      const components = await pool.query('SELECT * FROM isqm_components ORDER BY order_index');
      const objectives = await pool.query('SELECT * FROM quality_objectives WHERE organization_id=$1', [orgId]);
      const risks = await pool.query('SELECT * FROM quality_risks WHERE organization_id=$1 AND status != $2', [orgId, 'archived']);
      const responses = await pool.query('SELECT * FROM responses WHERE organization_id=$1', [orgId]);
      content = { organization: org.rows[0], components: components.rows, objectives: objectives.rows, risks: risks.rows, responses: responses.rows, generated_at: new Date().toISOString() };
    } else {
      content = { type, generated_at: new Date().toISOString(), note: 'Document type supported — populate with system data' };
    }

    // Get latest version
    const latest = await pool.query('SELECT MAX(version) as v FROM documents WHERE organization_id=$1 AND type=$2', [orgId, type]);
    const version = (latest.rows[0]?.v || 0) + 1;

    const r = await pool.query(
      'INSERT INTO documents (organization_id, type, version, content, status) VALUES ($1,$2,$3,$4,$5) RETURNING id, type, version, status, created_at',
      [orgId, type, version, JSON.stringify(content), 'draft']);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/approve', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'quality_partner') return res.status(403).json({ error: 'Insufficient role' });
  try {
    const r = await pool.query(
      "UPDATE documents SET status='approved', approved_by=$1 WHERE id=$2 AND organization_id=$3 RETURNING *",
      [req.user.id, req.params.id, req.user.organization_id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
