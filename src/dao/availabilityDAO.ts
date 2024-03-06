import { query } from '../config/database';

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
