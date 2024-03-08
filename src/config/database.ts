
/**
 * This module provides a connection pool and query function for interacting with a PostgreSQL database.
 */

import { Pool } from 'pg';
const fs = require('fs');

/**
 * The connection pool for the PostgreSQL database.
 */
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db',
  password: 'password',
  port: 5432,
});

/**
 * Executes a SQL query on the database.
 * @param text - The SQL query string.
 * @param params - Optional parameters for the query.
 * @returns A Promise that resolves to the query result.
 * @throws If an error occurs during the query execution.
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