const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // ローカル環境用

const app = express();
const port = process.env.PORT || 3001;
// CORS設定の改善
const corsOptions = {
  origin: [
    process.env.VITE_FRONTEND_URL, // RenderのフロントエンドURL
    'http://localhost:5173' // 開発環境
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 静的ファイル配信の追加（フロントエンドビルドファイル用）
app.use(express.static('dist'));
app.use(bodyParser.json());

// 環境変数からデータベース設定を取得
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // RenderのPostgreSQLに必須
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    };

const pool = new Pool(poolConfig);

// 非同期処理でテーブル作成
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE
      )
    `);
    console.log('Table created/verified');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1); // 起動失敗
  }
};

initializeDatabase();

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO email_subscribers (email) VALUES ($1) RETURNING id',
      [email]
    );
    res.status(201).json({ id: result.rows[0].id, email });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already subscribed' });
    } else {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});