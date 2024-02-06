import { query } from '../config/database';
import bcrypt from 'bcrypt';
import { User, sanitizeUser } from '../model/User';

export const createPerson = async (name: string, surname: string, pnr: string, email: string, rawPassword: string, roleId: number, username: string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    const sql = `
    INSERT INTO public.person (name, surname, pnr, email, password, role_id, username)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING person_id;`;

    const params = [name, surname, pnr, email, hashedPassword, roleId, username];

    try {
        const result = await query(sql, params);
        const user = result.rows[0];
        return user;
    } catch (err) {
        throw err;
    }
};


export const findPersonByUsername = async (username: string): Promise<User | null> => {
    const sql = `SELECT * FROM public.person WHERE username = $1;`;
    const params = [username];
  
    try {
      const result = await query(sql, params);
      if (result.rows.length) {
        const user: User = result.rows[0];
        return user;
      }
      return null;
    } catch (err) {
      throw err;
    }
  };


export const findPersonByEmail = async (email: string) => {
    const sql = `SELECT * FROM public.person WHERE email = $1;`;
    const params = [email];

    try {
        const result = await query(sql, params);
        const user: User = result.rows[0];
        return user;
    } catch (err) {
        throw err;
    }
};

//find persons where role ID is 2, put them into an array of type User and return it
export const findApplicants = async () => {
    const sql = `SELECT * FROM public.person WHERE role_id = 2;`;

    try {
        const result = await query(sql);

        // put into aray of users:
        const applicants: User[] = result.rows;
        return applicants;
    } catch (err) {
        throw err;
    }
};