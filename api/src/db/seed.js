require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const bcrypt = require('bcryptjs');

async function seed() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('Schema created.');

    // Seed a demo organization + admin user
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
         ON CONFLICT (email) DO NOTHING`,
        [hash, orgId]
      );
      console.log('Demo org + admin user created. Login: admin@cla.com.ro / admin123');
    }
    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await pool.end();
  }
}
seed();
