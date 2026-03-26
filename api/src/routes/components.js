const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM isqm_components ORDER BY order_index');
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
