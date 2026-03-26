const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT r.*, u.name as owner_name, COUNT(rr.risk_id) as linked_risks
       FROM responses r LEFT JOIN users u ON r.owner_id=u.id LEFT JOIN risk_responses rr ON r.id=rr.response_id
       WHERE r.organization_id=$1 GROUP BY r.id, u.name ORDER BY r.created_at DESC`,
      [req.user.organization_id]);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { title, description, owner_id, frequency, effectiveness_status } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const r = await pool.query(
      'INSERT INTO responses (organization_id, title, description, owner_id, frequency, effectiveness_status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.organization_id, title, description, owner_id, frequency, effectiveness_status || 'unknown']);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/link-risk', auth, async (req, res) => {
  const { risk_id, response_id } = req.body;
  if (!risk_id || !response_id) return res.status(400).json({ error: 'risk_id and response_id required' });
  try {
    await pool.query('INSERT INTO risk_responses (risk_id, response_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [risk_id, response_id]);
    res.json({ linked: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/controls', auth, async (req, res) => {
  const { response_id } = req.query;
  try {
    let q = 'SELECT c.*, u.name as reviewer_name FROM controls c LEFT JOIN users u ON c.reviewer_id=u.id';
    const params = [];
    if (response_id) { q += ' WHERE c.response_id=$1'; params.push(response_id); }
    q += ' ORDER BY c.title';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/controls', auth, async (req, res) => {
  const { response_id, title, description, control_type, evidence_required, reviewer_id } = req.body;
  if (!title || !response_id) return res.status(400).json({ error: 'title and response_id required' });
  try {
    const r = await pool.query(
      'INSERT INTO controls (response_id, title, description, control_type, evidence_required, reviewer_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [response_id, title, description, control_type || 'manual', evidence_required, reviewer_id]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
