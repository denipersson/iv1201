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