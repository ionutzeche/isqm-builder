const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Monitoring activities
router.get('/', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT ma.*, ic.name as component_name, p.name as practice_name, u.name as performer_name
       FROM monitoring_activities ma LEFT JOIN isqm_components ic ON ma.component_id=ic.id LEFT JOIN practices p ON ma.practice_id=p.id LEFT JOIN users u ON ma.performed_by=u.id
       WHERE ma.organization_id=$1 ORDER BY ma.performed_at DESC`,
      [req.user.organization_id]);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { title, component_id, practice_id, performed_by, performed_at, method, result, notes } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const r = await pool.query(
      'INSERT INTO monitoring_activities (organization_id, title, component_id, practice_id, performed_by, performed_at, method, result, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [req.user.organization_id, title, component_id, practice_id, performed_by, performed_at, method, result, notes]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Deficiencies
router.get('/deficiencies', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT d.*, ic.name as component_name, p.name as practice_name, u.name as owner_name
       FROM deficiencies d LEFT JOIN isqm_components ic ON d.component_id=ic.id LEFT JOIN practices p ON d.practice_id=p.id LEFT JOIN users u ON d.owner_id=u.id
       WHERE d.organization_id=$1 ORDER BY CASE d.severity WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, d.created_at DESC`,
      [req.user.organization_id]);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/deficiencies', auth, async (req, res) => {
  const { component_id, practice_id, title, description, severity, root_cause, identified_from, owner_id, due_date } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const r = await pool.query(
      'INSERT INTO deficiencies (organization_id, component_id, practice_id, title, description, severity, root_cause, identified_from, owner_id, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [req.user.organization_id, component_id, practice_id, title, description, severity || 'medium', root_cause, identified_from, owner_id, due_date]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/deficiencies/:id', auth, async (req, res) => {
  const { status, root_cause, owner_id, due_date } = req.body;
  try {
    const r = await pool.query(
      'UPDATE deficiencies SET status=$1, root_cause=$2, owner_id=$3, due_date=$4 WHERE id=$5 AND organization_id=$6 RETURNING *',
      [status, root_cause, owner_id, due_date, req.params.id, req.user.organization_id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Remediation
router.get('/remediation', auth, async (req, res) => {
  const { deficiency_id } = req.query;
  try {
    let q = 'SELECT ra.*, u.name as owner_name FROM remediation_actions ra LEFT JOIN users u ON ra.owner_id=u.id';
    const params = [];
    if (deficiency_id) { q += ' WHERE ra.deficiency_id=$1'; params.push(deficiency_id); }
    q += ' ORDER BY ra.target_date';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/remediation', auth, async (req, res) => {
  const { deficiency_id, description, owner_id, target_date } = req.body;
  if (!deficiency_id || !description) return res.status(400).json({ error: 'deficiency_id and description required' });
  try {
    const r = await pool.query(
      'INSERT INTO remediation_actions (deficiency_id, description, owner_id, target_date) VALUES ($1,$2,$3,$4) RETURNING *',
      [deficiency_id, description, owner_id, target_date]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/remediation/:id', auth, async (req, res) => {
  const { status, completed_at, evidence } = req.body;
  try {
    const r = await pool.query(
      'UPDATE remediation_actions SET status=$1, completed_at=$2, evidence=$3 WHERE id=$4 RETURNING *',
      [status, completed_at, evidence ? JSON.stringify(evidence) : null, req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
