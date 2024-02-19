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
    constructor(person_id : number, name: string, surname: string, email: string, password: string, pnr: string, role_id: number, username: string) {
        this.person_id = person_id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.competencies = [];
        this.pnr = pnr;
        this.role_id = role_id;
        this.username = username;
    }

    /* BROKEN
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
    }*/
} 


// Set User's password to '' when sending it to the client
export const sanitizeUser = (user: User): User => {
    const sanitizedUser = user;
    sanitizedUser.password = '';
    return sanitizedUser;
};

