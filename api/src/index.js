if (!process.env.VERCEL) require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/organization', require('./routes/organization'));
app.use('/api/components', require('./routes/components'));
app.use('/api/objectives', require('./routes/objectives'));
app.use('/api/risks', require('./routes/risks'));
app.use('/api/responses', require('./routes/responses'));
app.use('/api/monitoring', require('./routes/monitoring'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/documents', require('./routes/documents'));

// Seed endpoint — run once to create tables
app.get('/api/seed', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const pool = require('./db');
  const bcrypt = require('bcryptjs');
  try {
    // Add must_change_password column if missing, then rebuild components
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT TRUE').catch(()=>{});
    await pool.query('DROP TABLE IF EXISTS isqm_components CASCADE').catch(()=>{});
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
    await pool.query(schema);
    const orgResult = await pool.query(
      `INSERT INTO organizations (name, jurisdiction, legal_structure, network, partner_count, staff_count)
       VALUES ('CLA Romania', 'Romania', 'SRL', 'CLA Global', 4, 42)
       ON CONFLICT DO NOTHING RETURNING id`
    );
    const orgId = orgResult.rows[0]?.id;
    if (orgId) {
      // Clear existing users and re-seed with approved list only
      await pool.query('DELETE FROM users WHERE organization_id = $1', [orgId]);
      const hash = await bcrypt.hash('cla2026', 10);
      const staff = [
        ['laurentiu.vasile@cla.com.ro','Laurentiu Vasile','admin'],
        ['alina.ene@cla.com.ro','Alina Ene','contributor'],
        ['qasim.ranjha@cla.com.ro','Qasim Ranjha','contributor'],
        ['marfa.arif@cla.com.ro','Marfa Arif','contributor'],
        ['roxana.olteanu@cla.com.ro','Roxana Olteanu','contributor'],
        ['george.chiriac@cla.com.ro','George Chiriac','contributor'],
      ];
      for (const [email, name, role] of staff) {
        await pool.query(
          `INSERT INTO users (email, name, password_hash, organization_id, role)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
          [email, name, hash, orgId, role]);
      }
    }
    const components = await pool.query('SELECT COUNT(*) FROM isqm_components');
    const users = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ ok: true, components: parseInt(components.rows[0].count), users: parseInt(users.rows[0].count) });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Bulk import endpoint
app.post('/api/import', async (req, res) => {
  const auth = require('./middleware/auth');
  // Inline auth check
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  const jwt = require('jsonwebtoken');
  let decoded;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch(e) { return res.status(401).json({ error: 'Invalid token' }); }
  const userResult = await pool.query('SELECT id, organization_id FROM users WHERE id = $1', [decoded.id]);
  if (!userResult.rows[0]) return res.status(401).json({ error: 'User not found' });
  const orgId = userResult.rows[0].organization_id;
  const userId = userResult.rows[0].id;

  const { type, items } = req.body;
  if (!type || !Array.isArray(items)) return res.status(400).json({ error: 'type and items[] required' });

  let imported = 0;
  try {
    if (type === 'objectives') {
      for (const item of items) {
        if (!item.title || !item.component_id) continue;
        await pool.query('INSERT INTO quality_objectives (organization_id, component_id, title, description, owner_id, status) VALUES ($1,$2,$3,$4,$5,$6)',
          [orgId, item.component_id, item.title, item.description || '', item.owner_id || userId, item.status || 'draft']);
        imported++;
      }
    } else if (type === 'risks') {
      for (const item of items) {
        if (!item.title || !item.component_id) continue;
        await pool.query(
          `INSERT INTO quality_risks (organization_id, component_id, title, description, root_cause, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status, next_review_date)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [orgId, item.component_id, item.title, item.description || '', item.root_cause || '', item.inherent_likelihood || 3, item.inherent_impact || 3, item.residual_likelihood || 2, item.residual_impact || 2, item.owner_id || userId, item.status || 'active', item.next_review_date || null]);
        imported++;
      }
    } else if (type === 'deficiencies') {
      for (const item of items) {
        if (!item.title) continue;
        await pool.query(
          'INSERT INTO deficiencies (organization_id, title, description, severity, root_cause, owner_id, status, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
          [orgId, item.title, item.description || '', item.severity || 'medium', item.root_cause || '', item.owner_id || userId, item.status || 'open', item.due_date || null]);
        imported++;
      }
    }
    res.json({ ok: true, type, imported });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`ISQM-1 API running on port ${PORT}`));
}

module.exports = app;
