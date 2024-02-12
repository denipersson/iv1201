import { query } from '../config/database';
import { User } from '../model/User';


export const addCompetency = async ( user: User, competency: string) => {
    const sql = `INSERT INTO public.competency (name) VALUES ($1) RETURNING id;`;
    const params = [competency];

    try {
        const result = await query(sql, params);
        const competencyId = result.rows[0].id;

        const linkSql = `INSERT INTO public.person_competency (person_id, competency_id) VALUES ($1, $2);`;
        await query(linkSql, [user.person_id, competencyId]);
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


export const getCompetenciesForPersonByUsername = async (username: string) =>{
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
        console.log("Accessing " + username + " competence\n");
        return result.rows; 
    } catch (err) {
        throw err;
    }
}