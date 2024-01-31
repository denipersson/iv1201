import { Pool } from 'pg';

//ändra till erat
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Recruit',
  password: '1234',
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
