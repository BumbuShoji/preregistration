const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = new Database('mydb.sqlite');

// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS email_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE
  )
`);

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const stmt = db.prepare('INSERT INTO email_subscribers (email) VALUES (?)');
    const result = stmt.run(email);
    res.status(201).json({ id: result.lastInsertRowid, email });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already subscribed' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
