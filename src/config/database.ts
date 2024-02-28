import { Pool } from 'pg';
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db',
  password: 'password',
  port: 5432,
});

/**
 * Connect to the database and run a query.
 * 
 * @param text - The query to run
 * @param params - The parameters to pass to the query
 * @returns - The result of the query
 */
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release(); 
  }
};
/*
const setupDatabase = async () => {
    try {
        const sql = fs.readFileSync('./existing-database.sql', 'utf-8'); // Reads the SQL file from the root directory
        await query(sql);
        console.log('Database setup complete');
    } catch (err) {
        console.error('Error setting up database:', err);
    }
};

setupDatabase();
*/