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

    // Check if the the competency exists, else create a new competenceId for the new competency. 
    // This function is not case sensitive. So there will be two new id´s for "a" and "A"
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

export const addCompetenceToPerson = async (personId: number, competenceId: number, yearsOfExperience: number) => {
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

// sql query to check the database for added compentencies for a user.
// SELECT p.username, c.name AS competency_name, cp.years_of_experience
// FROM person p
// JOIN competence_profile cp ON p.person_id = cp.person_id
// JOIN competence c ON cp.competence_id = c.competence_id
// WHERE p.username = 'luu';

