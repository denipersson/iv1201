


import { query } from '../config/database';
import bcrypt from 'bcrypt';
import { User } from '../model/User';
import { getCompetenciesForPersonByUsername } from './CompetenceDAO';
import { getAvailabilityForPersonByUsername } from './availabilityDAO';

/**
 * Creates a new person in the database.
 * @param name - The person's name.
 * @param surname - The person's surname.
 * @param pnr - The person's personal identification number.
 * @param email - The person's email address.
 * @param rawPassword - The person's raw password.
 * @param roleId - The ID of the person's role.
 * @param username - The person's username.
 * @returns The ID of the created person.
 */
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

/**
 * Finds a person in the database by their username.
 * @param username - The username of the person to find.
 * @returns The found user or null if not found.
 */
export const findPersonByUsername = async (username: string): Promise<User | null> => {
    const sql = `SELECT * FROM public.person WHERE username = $1;`;
    const params = [username];

    try {
        const result = await query(sql, params);
        if (result.rows.length) {
            const user: User = new User(result.rows[0]);
            return user;
        }
        return null;
    } catch (err) {
        throw err;
    }
};

/**
 * Updates a person's password in the database.
 * @param username - The username of the person to update.
 * @param newPassword - The new password to set.
 */
export const updatePersonPassword = async (username: string, newPassword: string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const sql = `UPDATE public.person SET password = $1 WHERE username = $2;`;
    const params = [hashedPassword, username];

    try {
        await query(sql, params);
    } catch (err) {
        throw err;
    }
}

/**
 * Finds a person in the database by their email address.
 * @param email - The email address of the person to find.
 * @returns The found user or null if not found.
 */
export const findPersonByEmail = async (email: string): Promise<User | null> => {
    const sql = `SELECT * FROM public.person WHERE email = $1;`;
    const params = [email];

    try {
        const result = await query(sql, params);
        if (result.rows.length) {
            const user: User = new User(result.rows[0]);
            return user;
        }
        return null;
    } catch (err) {
        throw err;
    }
};

/**
 * Retrieves all applicants from the database.
 * @returns An array of User objects representing the applicants.
 */
export const getApplicantsDAO = async () => {
    const sql = `SELECT * FROM public.person WHERE role_id = 2;`;

    try {
        const result = await query(sql);
        let applicants: User[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            try {
                applicants[i] = new User(result.rows[i]);
                applicants[i].password = "-censored-";
                applicants[i].competencies = await getCompetenciesForPersonByUsername(applicants[i].username);
                applicants[i].availability = await getAvailabilityForPersonByUsername(applicants[i].username);
            } catch (err) {
                console.error("Error in getApplicantsDAO: " + err);
            }
        }
        return applicants;
    } catch (err) {
        throw err;
    }
}
