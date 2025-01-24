const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'preregistration_matchingcupid',
  host: 'localhost',
  database: 'email_subscribers',
  password: 'QY2J8z8z',
  port: 5432,
});

// テーブル作成
pool.query(`
  CREATE TABLE IF NOT EXISTS email_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  }
});

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('INSERT INTO email_subscribers (email) VALUES ($1) RETURNING id', [email]);
    res.status(201).json({ id: result.rows[0].id, email });
  } catch (error) {
    if (error.code === '23505') { // Unique violation error code in PostgreSQL
      res.status(400).json({ error: 'Email already subscribed' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
