import { Pool } from 'pg';
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db',
  password: 'password',
  port: 5432,
});


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