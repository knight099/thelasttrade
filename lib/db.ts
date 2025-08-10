import { Pool } from 'pg';

// Database connection configuration
let poolConfig: any = {
  connectionString: process.env.DATABASE_URL,
};

// Handle SSL configuration for different environments
if (process.env.DATABASE_URL?.includes('neon.tech')) {
  poolConfig.ssl = { rejectUnauthorized: false };
} else if (process.env.NODE_ENV === 'production') {
  poolConfig.ssl = { rejectUnauthorized: true };
} else {
  poolConfig.ssl = false;
}

// Ensure we ignore any local PostgreSQL defaults
if (process.env.DATABASE_URL) {
  // Parse URL to extract individual components if needed
  const url = new URL(process.env.DATABASE_URL);
  poolConfig = {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1), // Remove leading slash
    ssl: poolConfig.ssl,
  };
}

const pool = new Pool(poolConfig);

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Execute a query
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Get a client from the pool
export async function getClient() {
  return await pool.connect();
}

// Close the pool
export async function closePool() {
  await pool.end();
}

export default pool;
