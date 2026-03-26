const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { component_id } = req.query;
  try {
    let q = 'SELECT qo.*, ic.name as component_name, u.name as owner_name FROM quality_objectives qo LEFT JOIN isqm_components ic ON qo.component_id=ic.id LEFT JOIN users u ON qo.owner_id=u.id WHERE qo.organization_id=$1';
    const params = [req.user.organization_id];
    if (component_id) { q += ' AND qo.component_id=$2'; params.push(component_id); }
    q += ' ORDER BY ic.order_index, qo.created_at';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { component_id, title, description, owner_id, status } = req.body;
  if (!title || !component_id) return res.status(400).json({ error: 'title and component_id required' });
  try {
    const r = await pool.query(
      'INSERT INTO quality_objectives (organization_id, component_id, title, description, owner_id, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.organization_id, component_id, title, description, owner_id, status || 'draft']);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, owner_id, status } = req.body;
  try {
    const r = await pool.query(
      'UPDATE quality_objectives SET title=$1, description=$2, owner_id=$3, status=$4 WHERE id=$5 AND organization_id=$6 RETURNING *',
      [title, description, owner_id, status, req.params.id, req.user.organization_id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM quality_objectives WHERE id=$1 AND organization_id=$2', [req.params.id, req.user.organization_id]);
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
