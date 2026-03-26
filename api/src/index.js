require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/organization', require('./routes/organization'));
app.use('/components', require('./routes/components'));
app.use('/objectives', require('./routes/objectives'));
app.use('/risks', require('./routes/risks'));
app.use('/responses', require('./routes/responses'));
app.use('/monitoring', require('./routes/monitoring'));
app.use('/assessment', require('./routes/assessment'));
app.use('/documents', require('./routes/documents'));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ISQM-1 API running on port ${PORT}`));
