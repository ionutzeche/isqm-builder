const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { component_id, practice_id, owner_id, status } = req.query;
  try {
    let q = `SELECT qr.*, ic.name as component_name, p.name as practice_name, u.name as owner_name
             FROM quality_risks qr
             LEFT JOIN isqm_components ic ON qr.component_id=ic.id
             LEFT JOIN practices p ON qr.practice_id=p.id
             LEFT JOIN users u ON qr.owner_id=u.id
             WHERE qr.organization_id=$1`;
    const params = [req.user.organization_id];
    let i = 2;
    if (component_id) { q += ` AND qr.component_id=$${i++}`; params.push(component_id); }
    if (practice_id) { q += ` AND qr.practice_id=$${i++}`; params.push(practice_id); }
    if (owner_id) { q += ` AND qr.owner_id=$${i++}`; params.push(owner_id); }
    if (status) { q += ` AND qr.status=$${i++}`; params.push(status); }
    q += ' ORDER BY qr.residual_score DESC NULLS LAST, qr.created_at DESC';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const risk = await pool.query(
      `SELECT qr.*, ic.name as component_name, p.name as practice_name, u.name as owner_name
       FROM quality_risks qr LEFT JOIN isqm_components ic ON qr.component_id=ic.id LEFT JOIN practices p ON qr.practice_id=p.id LEFT JOIN users u ON qr.owner_id=u.id
       WHERE qr.id=$1 AND qr.organization_id=$2`, [req.params.id, req.user.organization_id]);
    if (!risk.rows[0]) return res.status(404).json({ error: 'Not found' });
    const responses = await pool.query(
      `SELECT r.* FROM responses r JOIN risk_responses rr ON r.id=rr.response_id WHERE rr.risk_id=$1`, [req.params.id]);
    res.json({ ...risk.rows[0], responses: responses.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { component_id, practice_id, objective_id, title, description, root_cause, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status, next_review_date } = req.body;
  if (!title || !component_id) return res.status(400).json({ error: 'title and component_id required' });
  try {
    const r = await pool.query(
      `INSERT INTO quality_risks (organization_id, component_id, practice_id, objective_id, title, description, root_cause, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status, next_review_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [req.user.organization_id, component_id, practice_id, objective_id, title, description, root_cause, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status || 'active', next_review_date]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, root_cause, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status, next_review_date } = req.body;
  try {
    const r = await pool.query(
      `UPDATE quality_risks SET title=$1, description=$2, root_cause=$3, inherent_likelihood=$4, inherent_impact=$5, residual_likelihood=$6, residual_impact=$7, owner_id=$8, status=$9, next_review_date=$10, updated_at=NOW()
       WHERE id=$11 AND organization_id=$12 RETURNING *`,
      [title, description, root_cause, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status, next_review_date, req.params.id, req.user.organization_id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('UPDATE quality_risks SET status=$1, updated_at=NOW() WHERE id=$2 AND organization_id=$3', ['archived', req.params.id, req.user.organization_id]);
    res.json({ archived: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
