import { getCompetenciesForPersonByUsername } from "../dao/CompetenceDAO";

// User.ts
export class User {
    person_id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    competencies: Array<string>;
    pnr: string;
    role_id: number;
    username: string;

    //checks email, but needs to be done frontend too.
    private isValidEmail(): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(this.email);
    }
    /** Fetches a person without competencies. 
     * 
     * @param result 
     */
    constructor(result: any){
        this.person_id = -1;
        this.name = "";
        this.surname = "";
        this.email = "";
        this.password = "";
        this.competencies = [];
        this.pnr = "";
        this.role_id = -1;
        this.username = "";
        try{
        const row = result.rows[0];
        this.name = row.name;
        this.surname = row.surname;
        this.email = row.email;
        //competencies måste dealas med seperat då de inte kommer finnas i user. 
        this.pnr = row.pnr;
        this.username = row.username;
        this.password = row.password;
        this.person_id = row.person_id;
        this.role_id = row.role_id;
        }
        catch(err){
            console.log("Error in constructor: " + err);
        }
    }
    static async createWithCompetencies(row: any): Promise<User> {
        const user = new User(row);
        try {
            const r = await getCompetenciesForPersonByUsername(row.username);
            user.competencies = r;

            ///console.log("Competencies:", user.competencies);
        } catch (err) {
            console.error('Error resolving competencies:', err);
            throw err;
        }
        return user;
    }
}

// Set User's password to '' when sending it to the client
export const sanitizeUser = (user: User): User => {
    const sanitizedUser = user;
    sanitizedUser.password = '';
    return sanitizedUser;
};

