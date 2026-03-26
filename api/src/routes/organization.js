const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM organizations WHERE id = $1', [req.user.organization_id]);
    res.json(r.rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/', auth, async (req, res) => {
  const { name, jurisdiction, legal_structure, network, description, partner_count, staff_count } = req.body;
  try {
    const r = await pool.query(
      `UPDATE organizations SET name=$1, jurisdiction=$2, legal_structure=$3, network=$4, description=$5, partner_count=$6, staff_count=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [name, jurisdiction, legal_structure, network, description, partner_count, staff_count, req.user.organization_id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/offices', auth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM offices WHERE organization_id = $1 ORDER BY name', [req.user.organization_id]);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/offices', auth, async (req, res) => {
  const { name, country, lead_partner } = req.body;
  try {
    const r = await pool.query('INSERT INTO offices (organization_id, name, country, lead_partner) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.organization_id, name, country, lead_partner]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/practices', auth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM practices WHERE organization_id = $1 ORDER BY name', [req.user.organization_id]);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/practices', auth, async (req, res) => {
  const { name, headcount, partner_count, is_regulated } = req.body;
  try {
    const r = await pool.query('INSERT INTO practices (organization_id, name, headcount, partner_count, is_regulated) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.user.organization_id, name, headcount || 0, partner_count || 0, is_regulated || false]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
