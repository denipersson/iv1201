import { query } from '../config/database';
import bcrypt from 'bcrypt';
import { User } from '../model/User';

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


export const findPersonByUsername = async (username: string): Promise<User | null> => {
    const sql = `SELECT * FROM public.person WHERE username = $1;`;
    const params = [username];

    try {
        const result = await query(sql, params);
        if (result.rows.length) {
            // Directly use the result to create a User instance
            const user = new User(result); //uses the "USER" class, hence we can use that in future.
            return user;
        }
        return null;
    } catch (err) {
        throw err;
    }
};


export const findPersonByEmail = async (email: string): Promise<User | null> => {
    const sql = `SELECT * FROM public.person WHERE email = $1;`;
    const params = [email];

    try {
        const result = await query(sql, params);
        if (result.rows.length) {
            // Directly use the result to create a User instance
            const user = new User(result); // Here, ensuring `result` fits the User constructor expectation
            return user;
        }
        return null;
    } catch (err) {
        throw err;
    }
};

export const addCompetency = async ( user: User, competency: string) => {
    
}

export const updateCompetencies = async (user: User, competencies: string[]) => {
    // Begin transaction
    await query('BEGIN');

    try {
        // Clear existing competencies for the user using the username
        const clearSql = `DELETE FROM person_competency pc 
                          USING person p
                          WHERE pc.person_id = p.id AND p.username = $1;`;
        await query(clearSql, [user.username]);

        for (const competency of competencies) {
            let competencyId;
            const competencyCheckSql = `SELECT id FROM competency WHERE name = $1;`;
            const competencyResult = await query(competencyCheckSql, [competency]);

            if (competencyResult.rows.length === 0) {
                // Insert competency if it doesn't exist
                const insertCompetencySql = `INSERT INTO competency (name) VALUES ($1) RETURNING id;`;
                const insertedCompetency = await query(insertCompetencySql, [competency]);
                competencyId = insertedCompetency.rows[0].id;
            } else {
                // Use existing competency ID
                competencyId = competencyResult.rows[0].id;
            }

            // b. Link user to competency in `person_competency` using the username
            const linkSql = `INSERT INTO person_competency (person_id, competency_id) 
                             SELECT p.id, $2 FROM person p WHERE p.username = $1;`;
            await query(linkSql, [user.username, competencyId]);
        }

        // Commit the transaction if all goes well
        await query('COMMIT');
    } catch (err) {
        // Rollback the transaction in case of error
        await query('ROLLBACK');
        throw err; // Rethrow the error for further handling/logging
    }
};

