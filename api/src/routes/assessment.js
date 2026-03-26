const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/:year', auth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM annual_assessments WHERE organization_id=$1 AND year=$2', [req.user.organization_id, req.params.year]);
    res.json(r.rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { year, summary_of_changes, risk_summary, deficiency_summary, conclusion, is_effective } = req.body;
  if (!year) return res.status(400).json({ error: 'year required' });
  try {
    const r = await pool.query(
      `INSERT INTO annual_assessments (organization_id, year, summary_of_changes, risk_summary, deficiency_summary, conclusion, is_effective)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.organization_id, year, summary_of_changes, risk_summary, deficiency_summary, conclusion, is_effective]);
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { summary_of_changes, risk_summary, deficiency_summary, conclusion, is_effective, status } = req.body;
  try {
    const r = await pool.query(
      `UPDATE annual_assessments SET summary_of_changes=$1, risk_summary=$2, deficiency_summary=$3, conclusion=$4, is_effective=$5, status=$6
       WHERE id=$7 AND organization_id=$8 RETURNING *`,
      [summary_of_changes, risk_summary, deficiency_summary, conclusion, is_effective, status, req.params.id, req.user.organization_id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/approve', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'quality_partner') return res.status(403).json({ error: 'Only admin or quality_partner can approve' });
  try {
    // Check unresolved deficiencies
    const defCheck = await pool.query(
      "SELECT COUNT(*) FROM deficiencies WHERE organization_id=$1 AND status != 'closed' AND severity='high'",
      [req.user.organization_id]);
    const openHigh = parseInt(defCheck.rows[0].count);

    const r = await pool.query(
      `UPDATE annual_assessments SET status='approved', approved_at=NOW(), approved_by=$1 WHERE id=$2 AND organization_id=$3 RETURNING *`,
      [req.user.id, req.params.id, req.user.organization_id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json({ ...r.rows[0], warning: openHigh > 0 ? `${openHigh} high-severity deficiencies remain open` : null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
