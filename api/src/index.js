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
    // Clean slate: remove all orphaned orgs and data, keep one org
    // First find if any users exist to identify their org
    const existingUsers = await pool.query(`SELECT DISTINCT organization_id FROM users WHERE email = 'laurentiu.vasile@cla.com.ro' LIMIT 1`);
    let orgId;
    if (existingUsers.rows.length) {
      orgId = existingUsers.rows[0].organization_id;
      // Delete all other orgs
      await pool.query('DELETE FROM organizations WHERE id != $1', [orgId]).catch(()=>{});
      // Update this org
      await pool.query(`UPDATE organizations SET name='CLA Romania', jurisdiction='Romania', legal_structure='SRL', network='CLA Global', partner_count=4, staff_count=40 WHERE id=$1`, [orgId]);
    } else {
      // No users yet — clean everything and start fresh
      await pool.query('DELETE FROM remediation_actions').catch(()=>{});
      await pool.query('DELETE FROM deficiencies').catch(()=>{});
      await pool.query('DELETE FROM monitoring_activities').catch(()=>{});
      await pool.query('DELETE FROM risk_responses').catch(()=>{});
      await pool.query('DELETE FROM responses').catch(()=>{});
      await pool.query('DELETE FROM quality_risks').catch(()=>{});
      await pool.query('DELETE FROM quality_objectives').catch(()=>{});
      await pool.query('DELETE FROM users').catch(()=>{});
      await pool.query('DELETE FROM organizations').catch(()=>{});
      const newOrg = await pool.query(
        `INSERT INTO organizations (name, jurisdiction, legal_structure, network, partner_count, staff_count)
         VALUES ('CLA Romania', 'Romania', 'SRL', 'CLA Global', 4, 40) RETURNING id`);
      orgId = newOrg.rows[0].id;
    }
    if (orgId) {
      // Clear existing users and re-seed with approved list only
      await pool.query('DELETE FROM users WHERE organization_id = $1', [orgId]);
      const hash = await bcrypt.hash('cla2026', 10);
      const staff = [
        ['ionut.zeche@cla.com.ro','Ionut Zeche','admin'],
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
    // Seed ISQM-1 V1.0 content from design documentation
    const content = require('./db/seed-content');
    const userMap = {};
    const uResult = await pool.query('SELECT id, email FROM users WHERE organization_id = $1', [orgId]);
    uResult.rows.forEach(u => { userMap[u.email] = u.id; });

    const compResult = await pool.query('SELECT id, name, order_index FROM isqm_components ORDER BY order_index');
    const compMap = {};
    compResult.rows.forEach(c => { compMap[c.order_index] = c.id; });

    // Update org description
    await pool.query('UPDATE organizations SET description = $1 WHERE id = $2', [content.firmProfile.description, orgId]);

    let objCount = 0, riskCount = 0, respCount = 0;
    for (const comp of content.components) {
      const compId = compMap[comp.order];
      if (!compId) continue;
      const ownerId = userMap[comp.ownerEmail] || null;

      // Seed objective
      const objCheck = await pool.query('SELECT id FROM quality_objectives WHERE organization_id=$1 AND component_id=$2 AND title=$3', [orgId, compId, comp.objective]);
      if (!objCheck.rows.length) {
        await pool.query('INSERT INTO quality_objectives (organization_id, component_id, title, description, owner_id, status) VALUES ($1,$2,$3,$4,$5,$6)',
          [orgId, compId, comp.objective, 'Component ' + comp.code + ' — ' + comp.name + '. Version 1.0 March 2026.', ownerId, 'in_progress']);
        objCount++;
      }

      // Seed risks with linked responses
      for (const risk of comp.risks) {
        const rating = content.riskScale[risk.rating] || { l: 3, i: 3 };
        const riskCheck = await pool.query('SELECT id FROM quality_risks WHERE organization_id=$1 AND component_id=$2 AND title=$3', [orgId, compId, risk.text]);
        let riskId;
        if (!riskCheck.rows.length) {
          const rr = await pool.query(
            `INSERT INTO quality_risks (organization_id, component_id, title, description, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status, next_review_date)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active','2026-06-30') RETURNING id`,
            [orgId, compId, risk.text, 'CaseWare ref: ' + (risk.cwRef || ''), rating.l, rating.i, Math.max(1, rating.l - 1), Math.max(1, rating.i - 1), ownerId]);
          riskId = rr.rows[0].id;
          riskCount++;
        } else {
          riskId = riskCheck.rows[0].id;
        }

        // Seed policy response
        if (risk.policy) {
          const respCheck = await pool.query('SELECT id FROM responses WHERE organization_id=$1 AND title=$2', [orgId, risk.policy]);
          let respId;
          if (!respCheck.rows.length) {
            const rResp = await pool.query('INSERT INTO responses (organization_id, title, description, owner_id, frequency, effectiveness_status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
              [orgId, risk.policy, 'Procedure: ' + (risk.procedure || ''), ownerId, 'annual', 'unknown']);
            respId = rResp.rows[0].id;
            respCount++;
          } else {
            respId = respCheck.rows[0].id;
          }
          await pool.query('INSERT INTO risk_responses (risk_id, response_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [riskId, respId]);
        }
      }
    }

    const components = await pool.query('SELECT COUNT(*) FROM isqm_components');
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const objectives = await pool.query('SELECT COUNT(*) FROM quality_objectives WHERE organization_id=$1', [orgId]);
    const risks = await pool.query('SELECT COUNT(*) FROM quality_risks WHERE organization_id=$1', [orgId]);
    const responses = await pool.query('SELECT COUNT(*) FROM responses WHERE organization_id=$1', [orgId]);
    // Seed monitoring activities from CLA Global Review
    let monCount = 0, defCount = 0;
    if (content.monitoringActivities) {
      for (const ma of content.monitoringActivities) {
        const check = await pool.query('SELECT id FROM monitoring_activities WHERE organization_id=$1 AND title=$2', [orgId, ma.title]);
        if (!check.rows.length) {
          await pool.query('INSERT INTO monitoring_activities (organization_id, title, method, result, notes, performed_at) VALUES ($1,$2,$3,$4,$5,$6)',
            [orgId, ma.title, ma.method, ma.result, ma.notes, '2025-09-10']);
          monCount++;
        }
      }
    }

    // Seed deficiencies from CLA Global Review
    if (content.deficiencies) {
      for (const def of content.deficiencies) {
        const check = await pool.query('SELECT id FROM deficiencies WHERE organization_id=$1 AND title=$2', [orgId, def.title]);
        if (!check.rows.length) {
          // Find component ID
          let defCompId = null;
          const compMatch = content.components.find(c => c.code === def.component);
          if (compMatch) defCompId = compMap[compMatch.order];

          const defResult = await pool.query(
            'INSERT INTO deficiencies (organization_id, component_id, title, description, severity, root_cause, status, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
            [orgId, defCompId, def.title, 'Source: ' + def.source, def.severity, def.root_cause, def.status, def.due]);
          defCount++;

          // Add remediation action
          if (def.remediation) {
            await pool.query('INSERT INTO remediation_actions (deficiency_id, description, target_date, status) VALUES ($1,$2,$3,$4)',
              [defResult.rows[0].id, def.remediation, def.due, 'open']);
          }
        }
      }
    }

    const compCount = await pool.query('SELECT COUNT(*) FROM isqm_components');
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const objTotal = await pool.query('SELECT COUNT(*) FROM quality_objectives WHERE organization_id=$1', [orgId]);
    const riskTotal = await pool.query('SELECT COUNT(*) FROM quality_risks WHERE organization_id=$1', [orgId]);
    const respTotal = await pool.query('SELECT COUNT(*) FROM responses WHERE organization_id=$1', [orgId]);
    const monTotal = await pool.query('SELECT COUNT(*) FROM monitoring_activities WHERE organization_id=$1', [orgId]);
    const defTotal = await pool.query('SELECT COUNT(*) FROM deficiencies WHERE organization_id=$1', [orgId]);
    res.json({ ok: true, components: parseInt(compCount.rows[0].count), users: parseInt(userCount.rows[0].count), objectives: parseInt(objTotal.rows[0].count), risks: parseInt(riskTotal.rows[0].count), responses: parseInt(respTotal.rows[0].count), monitoring: parseInt(monTotal.rows[0].count), deficiencies: parseInt(defTotal.rows[0].count), seeded: { objectives: objCount, risks: riskCount, responses: respCount, monitoring: monCount, deficiencies: defCount } });
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

// Full reset — wipes everything and re-seeds from scratch
app.get('/api/reset', async (req, res) => {
  const pool = require('./db');
  const bcrypt = require('bcryptjs');
  const fs = require('fs');
  const path = require('path');
  try {
    // Drop all data tables and recreate
    await pool.query('DROP TABLE IF EXISTS remediation_actions CASCADE');
    await pool.query('DROP TABLE IF EXISTS deficiencies CASCADE');
    await pool.query('DROP TABLE IF EXISTS monitoring_activities CASCADE');
    await pool.query('DROP TABLE IF EXISTS risk_responses CASCADE');
    await pool.query('DROP TABLE IF EXISTS controls CASCADE');
    await pool.query('DROP TABLE IF EXISTS responses CASCADE');
    await pool.query('DROP TABLE IF EXISTS quality_risks CASCADE');
    await pool.query('DROP TABLE IF EXISTS quality_objectives CASCADE');
    await pool.query('DROP TABLE IF EXISTS documents CASCADE');
    await pool.query('DROP TABLE IF EXISTS annual_assessments CASCADE');
    await pool.query('DROP TABLE IF EXISTS service_lines CASCADE');
    await pool.query('DROP TABLE IF EXISTS practices CASCADE');
    await pool.query('DROP TABLE IF EXISTS offices CASCADE');
    await pool.query('DROP TABLE IF EXISTS audit_log CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    await pool.query('DROP TABLE IF EXISTS isqm_components CASCADE');
    await pool.query('DROP TABLE IF EXISTS organizations CASCADE');
    // Recreate schema
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
    await pool.query(schema);
    // Create org
    const orgResult = await pool.query(
      `INSERT INTO organizations (name, jurisdiction, legal_structure, network, partner_count, staff_count)
       VALUES ('CLA Romania', 'Romania', 'SRL', 'CLA Global', 4, 40) RETURNING id`);
    const orgId = orgResult.rows[0].id;
    // Create users
    const hash = await bcrypt.hash('cla2026', 10);
    const staff = [
      ['ionut.zeche@cla.com.ro','Ionut Zeche','admin'],
      ['laurentiu.vasile@cla.com.ro','Laurentiu Vasile','admin'],
      ['alina.ene@cla.com.ro','Alina Ene','contributor'],
      ['qasim.ranjha@cla.com.ro','Qasim Ranjha','contributor'],
      ['marfa.arif@cla.com.ro','Marfa Arif','contributor'],
      ['roxana.olteanu@cla.com.ro','Roxana Olteanu','contributor'],
      ['george.chiriac@cla.com.ro','George Chiriac','contributor'],
    ];
    for (const [email, name, role] of staff) {
      await pool.query('INSERT INTO users (email, name, password_hash, organization_id, role, must_change_password) VALUES ($1,$2,$3,$4,$5,true)', [email, name, hash, orgId, role]);
    }
    // Seed content
    const content = require('./db/seed-content');
    const userMap = {};
    const uResult = await pool.query('SELECT id, email FROM users WHERE organization_id = $1', [orgId]);
    uResult.rows.forEach(u => { userMap[u.email] = u.id; });
    const compResult = await pool.query('SELECT id, order_index FROM isqm_components ORDER BY order_index');
    const compMap = {};
    compResult.rows.forEach(c => { compMap[c.order_index] = c.id; });
    await pool.query('UPDATE organizations SET description = $1 WHERE id = $2', [content.firmProfile.description, orgId]);
    let objCount=0, riskCount=0, respCount=0;
    for (const comp of content.components) {
      const compId = compMap[comp.order]; if (!compId) continue;
      const ownerId = userMap[comp.ownerEmail] || null;
      await pool.query('INSERT INTO quality_objectives (organization_id, component_id, title, description, owner_id, status) VALUES ($1,$2,$3,$4,$5,$6)',
        [orgId, compId, comp.objective, 'Component ' + comp.code + ' — ' + comp.name, ownerId, 'in_progress']);
      objCount++;
      for (const risk of comp.risks) {
        const rating = content.riskScale[risk.rating] || { l: 3, i: 3 };
        const rr = await pool.query(
          `INSERT INTO quality_risks (organization_id, component_id, title, description, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, owner_id, status, next_review_date)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active','2026-06-30') RETURNING id`,
          [orgId, compId, risk.text, 'CaseWare ref: ' + (risk.cwRef || ''), rating.l, rating.i, Math.max(1, rating.l - 1), Math.max(1, rating.i - 1), ownerId]);
        riskCount++;
        if (risk.policy) {
          const rResp = await pool.query('INSERT INTO responses (organization_id, title, description, owner_id, frequency, effectiveness_status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [orgId, risk.policy, 'Procedure: ' + (risk.procedure || ''), ownerId, 'annual', 'unknown']);
          respCount++;
          await pool.query('INSERT INTO risk_responses (risk_id, response_id) VALUES ($1,$2)', [rr.rows[0].id, rResp.rows[0].id]);
        }
      }
    }
    // Monitoring
    let monCount=0;
    if (content.monitoringActivities) {
      for (const ma of content.monitoringActivities) {
        await pool.query('INSERT INTO monitoring_activities (organization_id, title, method, result, notes, performed_at) VALUES ($1,$2,$3,$4,$5,$6)',
          [orgId, ma.title, ma.method, ma.result, ma.notes, '2025-09-10']);
        monCount++;
      }
    }
    // Deficiencies
    let defCount=0;
    if (content.deficiencies) {
      for (const def of content.deficiencies) {
        let defCompId = null;
        const compMatch = content.components.find(c => c.code === def.component);
        if (compMatch) defCompId = compMap[compMatch.order];
        const defResult = await pool.query(
          'INSERT INTO deficiencies (organization_id, component_id, title, description, severity, root_cause, status, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
          [orgId, defCompId, def.title, 'Source: ' + def.source, def.severity, def.root_cause, def.status, def.due]);
        defCount++;
        if (def.remediation) {
          await pool.query('INSERT INTO remediation_actions (deficiency_id, description, target_date, status) VALUES ($1,$2,$3,$4)',
            [defResult.rows[0].id, def.remediation, def.due, 'open']);
        }
      }
    }
    res.json({ ok: true, reset: true, components: 8, users: staff.length, objectives: objCount, risks: riskCount, responses: respCount, monitoring: monCount, deficiencies: defCount });
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
