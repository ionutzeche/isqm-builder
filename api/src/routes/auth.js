const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, org: user.organization_id }, SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, organization_id: user.organization_id },
      must_change_password: user.must_change_password || false
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/me', auth, (req, res) => res.json(req.user));

// List all users in organization
router.get('/users', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, email, name, role, must_change_password, created_at FROM users WHERE organization_id = $1 ORDER BY role, name`,
      [req.user.organization_id]
    );
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update user role
router.put('/users/:id/role', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'quality_partner') return res.status(403).json({ error: 'Admin or quality_partner required' });
  const { role } = req.body;
  const validRoles = ['admin', 'quality_partner', 'engagement_partner', 'manager', 'staff', 'viewer'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role. Must be: ' + validRoles.join(', ') });
  try {
    const r = await pool.query('UPDATE users SET role = $1 WHERE id = $2 AND organization_id = $3 RETURNING id, email, name, role', [role, req.params.id, req.user.organization_id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Reset user password (admin only)
router.post('/users/:id/reset-password', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    const hash = await bcrypt.hash('cla2026', 10);
    await pool.query('UPDATE users SET password_hash = $1, must_change_password = true WHERE id = $2 AND organization_id = $3', [hash, req.params.id, req.user.organization_id]);
    res.json({ ok: true, message: 'Password reset to default. User must change on next login.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/change-password', auth, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!new_password || new_password.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  try {
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    if (current_password) {
      const valid = await bcrypt.compare(current_password, result.rows[0].password_hash);
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = $1, must_change_password = false WHERE id = $2', [hash, req.user.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
