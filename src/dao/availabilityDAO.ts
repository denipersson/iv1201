
import { query } from '../config/database';

/**
 * Adds availability for a person.
 * @param personId - The ID of the person.
 * @param fromDate - The start date of the availability.
 * @param toDate - The end date of the availability.
 * @throws Throws an error if there is an issue with the database query.
 */
export const addAvailabilityForPerson = async (personId: number, fromDate: string, toDate: string) => {
    const sql = `
    INSERT INTO availability (person_id, from_date, to_date)
    VALUES ($1, $2, $3);
    `;
    const params = [personId, fromDate, toDate];

    try {
        await query(sql, params);
    } catch (err) {
        throw err;
    }
    
};

/**
 * Retrieves the availability for a person based on their username.
 * @param {string} username - The username of the person.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of availability objects.
 * @throws {Error} - If an error occurs while querying the database.
 */
export const getAvailabilityForPersonByUsername = async (username: string) => {
    const sql = `
    SELECT p.username, a.from_date, a.to_date
    FROM person p
    JOIN availability a ON p.person_id = a.person_id
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
