import { Pool } from "pg";

let pool: Pool;

async function init() {
  const user = process.env.DB_USER as string;
  const host = process.env.DB_HOST as string;
  const database = process.env.DB_NAME as string;
  const password = process.env.DB_PASSWORD as string;
  const ca = process.env.DB_CA as string;
  const port = parseInt((process.env.DB_PORT as string) || "5432");

  if (!user || !host || !database || !password) {
    throw new Error("Database environment variables are not set");
  }

  pool = new Pool({
    user,
    host,
    database,
    password,
    port,
    ssl: {
      ca,
    },
  });
  console.log("Database up");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_name VARCHAR(255) NOT NULL,
      stored_name VARCHAR(255) NOT NULL,
      cloudinary_url TEXT,
      public_id VARCHAR(255),
      mime_type VARCHAR(100) NOT NULL,
      size BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function getPool() {
  if (!pool) {
    throw new Error("Database not initialized. Call init() first.");
  }
  return pool;
}

export { init, getPool };
