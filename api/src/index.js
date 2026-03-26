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
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
    await pool.query(schema);
    const orgResult = await pool.query(
      `INSERT INTO organizations (name, jurisdiction, legal_structure, network, partner_count, staff_count)
       VALUES ('CLA Romania', 'Romania', 'SRL', 'CLA Global', 4, 42)
       ON CONFLICT DO NOTHING RETURNING id`
    );
    const orgId = orgResult.rows[0]?.id;
    if (orgId) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO users (email, name, password_hash, organization_id, role)
         VALUES ('admin@cla.com.ro', 'Ionut Zeche', $1, $2, 'admin')
         ON CONFLICT (email) DO NOTHING`, [hash, orgId]);
    }
    const components = await pool.query('SELECT COUNT(*) FROM isqm_components');
    const users = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ ok: true, components: parseInt(components.rows[0].count), users: parseInt(users.rows[0].count) });
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
