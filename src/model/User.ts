import { getCompetenciesForPersonByEmail, getCompetenciesForPersonByUsername } from "../dao/CompetenceDAO";

// User.ts
export class User {
    person_id: number;
    name: string;
    surname: string;
    email: string;
    competencies: any;
    password: string;
    pnr: string;
    role_id: number;
    username: string;

    /**
     * Checks if the email is valid.
     * 
     * @returns 
     */
    //checks email, but needs to be done frontend too
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
        this.competencies = [];
        try {
            if (!row.username) {
                this.username = row.name.toLowerCase() + "." + row.surname.toLowerCase();
            }
            else{
                this.username = row.username;
            }
            if(!row.password){
                this.password = "69696969";
            }
            else{
                this.password = row.password;
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
                user.competencies = r;

            }else if(user.email !== undefined && user.email !== null && user.email !== ""){
                const r = await getCompetenciesForPersonByEmail(user.email);
                user.competencies = r;
            }

            if(user.competencies.length !== 0){
            }
        } catch (err) {
            console.error('Error resolving competencies:', err);
            throw err;
        }
        return user;
    }
} 


// Set User's password to '' when sending it to the client
/**
 * Sanitize the user object by setting the password to ''.
 * 
 * @param user  - The user object
 * @returns - The user without the password
 */
export const sanitizeUser = (user: User): User => {
    const sanitizedUser = user;
    sanitizedUser.password = '';
    return sanitizedUser;
};

