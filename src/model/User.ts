import { getCompetenciesForPersonByEmail, getCompetenciesForPersonByUsername } from "../dao/CompetenceDAO";

// User.ts
export class User {
    person_id: number;
    name: string;
    surname: string;
    email: string;
    compentencies: any;
    password: string;
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
    constructor(row: any){
        this.person_id = -1;
        this.name = "";
        this.surname = "";
        this.email = "";
        this.password = "";
        this.pnr = "";
        this.role_id = -1;
        this.username = "";
        this.compentencies = [];
        try {
            console.log(row);
            if (!row.username) {
                this.username = row.name.toLowerCase() + "." + row.surname.toLowerCase();
            }
            else{
                this.username = row.username;
            }
            this.name = row.name;
            this.surname = row.surname;
            this.email = row.email;
            this.pnr = row.pnr;
            this.person_id = row.person_id;
            this.role_id = row.role_id;
        } catch (err) {
            throw err;
        }
    }
    /**DEPRECATED
     * 
     * @param result 
     * @returns 
     */
    static async createWithCompetencies(result: any): Promise<User> {
        //console.log(result);
        if(result == null || result.rows == null){ throw new Error("Missing data. Skipping this person."); }
    
        const user = new User(result.rows[0]);
        //console.log("Creating user with competencies" + user.username + " " + user.competencies);
        try {
            if(user.username === undefined || user.username === null || user.username === "") {
                console.log("No username found, trying to find by email");
            }
            if(user.username !== undefined && user.username !== null && user.username !== "") {
                const r = await getCompetenciesForPersonByUsername(user.username);
                user.compentencies = r;

            }else if(user.email !== undefined && user.email !== null && user.email !== ""){
                const r = await getCompetenciesForPersonByEmail(user.email);
                user.compentencies = r;
            }

            if(user.compentencies.length !== 0){
            console.log("Competencies:", user.compentencies);
            }
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

