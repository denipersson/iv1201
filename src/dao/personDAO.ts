import { query } from '../config/database';
import bcrypt from 'bcrypt';

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
        return result.rows[0]; // Assuming we want to return the created person's ID
    } catch (err) {
        throw err;
    }
};

export const findPersonByUsername = async (username: string) => {
    const sql = `SELECT * FROM public.person WHERE username = $1;`;
    const params = [username];
    

    try {
        const result = await query(sql, params);
        if (result.rows.length) {
            console.log(result.rows[0]);
            return result.rows[0];
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
        return result.rows.length ? result.rows[0] : null;
    } catch (err) {
        throw err;
    }
};

