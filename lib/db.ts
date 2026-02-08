import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: String(process.env.PGPASSWORD), // 🔴 КРИТИЧНО
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
  
});

export default pool;
