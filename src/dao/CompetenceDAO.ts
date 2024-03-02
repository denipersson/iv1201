


import { query } from '../config/database';

/**
 * Checks if the competency exists, else creates a new competenceId for the new competency.
 * This function is not case sensitive. So there will be two new ids for "a" and "A".
 * @param name - The name of the competency.
 * @returns The competenceId of the existing or newly created competency.
 * @throws Throws an error if there is an issue with the database query.
 */
export const findOrCreateCompetence = async (name: string) => {
    let sql = `SELECT competence_id FROM public.competence WHERE name = $1;`;
    let params = [name];
    try {
        let result = await query(sql, params);
        if (result.rows.length === 0) {
            sql = `INSERT INTO public.competence (name) VALUES ($1) RETURNING competence_id;`;
            result = await query(sql, params);
        }
        return result.rows[0].competence_id;
    } catch (err) {
        throw err;
    }
};

/**
 * Inserts a competence to a person's competence profile.
 * @param personId - The ID of the person.
 * @param competenceId - The ID of the competence.
 * @param yearsOfExperience - The number of years of experience in the competence.
 * @returns The competence profile ID of the inserted competence.
 * @throws Throws an error if there is an issue with the database query.
 */
export const insertCompetenceToPerson = async (personId: number, competenceId: number, yearsOfExperience: number) => {
    const sql = `
    INSERT INTO public.competence_profile (person_id, competence_id, years_of_experience)
    VALUES ($1, $2, $3)
    RETURNING competence_profile_id;`;

    const params = [personId, competenceId, yearsOfExperience];

    try {
        const result = await query(sql, params);
        return result.rows[0]; 
    } catch (err) {
        throw err;
    }
};

/**
 * Retrieves the competencies for a person by their username.
 * @param username - The username of the person.
 * @returns An array of objects containing the person's username, competency name, and years of experience.
 * @throws Throws an error if there is an issue with the database query.
 */
export const getCompetenciesForPersonByUsername = async (username: string) => {
    const sql = `
    SELECT p.username, c.name AS competency_name, cp.years_of_experience
    FROM person p
    JOIN competence_profile cp ON p.person_id = cp.person_id
    JOIN competence c ON cp.competence_id = c.competence_id  
    WHERE p.username = $1;
    `;

    const params = [username];
    
    try {
        const result = await query(sql, params);
        return result.rows; 
    } catch (err) {
        throw err;
    }
};

/**
 * Retrieves the competencies for a person by their email.
 * @param email - The email of the person.
 * @returns An array of objects containing the person's email, competency name, and years of experience.
 * @throws Throws an error if there is an issue with the database query.
 */
export const getCompetenciesForPersonByEmail = async (email: string) => {
    const sql = `
    SELECT p.email, c.name AS competency_name, cp.years_of_experience
    FROM person p
    JOIN competence_profile cp ON p.person_id = cp.person_id
    JOIN competence c ON cp.competence_id = c.competence_id  
    WHERE p.email = $1;
    `;

    const params = [email];
    
    try {
        const result = await query(sql, params);
        return result.rows; 
    } catch (err) {
        throw err;
    }
};

/**
 * Retrieves the competencies for a person by their ID.
 * @param personId - The ID of the person.
 * @returns An array of objects containing the person's ID, competency name, and years of experience.
 * @throws Throws an error if there is an issue with the database query.
 */
export const getCompetenciesForPersonById = async (personId: number) => {
    const sql = `
    SELECT p.person_id, c.name AS competency_name, cp.years_of_experience
    FROM person p
    JOIN competence_profile cp ON p.person_id = cp.person_id
    JOIN competence c ON cp.competence_id = c.competence_id  
    WHERE p.person_id = $1;
    `;

    const params = [personId];
    
    try {
        const result = await query(sql, params);
        return result.rows; 
    } catch (err) {
        throw err;
    }
};
