import { getCompetenciesForPersonByEmail, getCompetenciesForPersonByUsername } from "../dao/CompetenceDAO";

/**
 * Represents a User in the system.
 */
export class User {
    person_id: number;
    name: string;
    surname: string;
    email: string;
    competencies: any;
    availability: any;
    password: string;
    pnr: string;
    role_id: number;
    username: string;

    /**
     * Checks if the email is valid.
     * @returns True if the email is valid, false otherwise.
     */
    private isValidEmail(): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(this.email);
    }

    /**
     * Creates a new User instance.
     * @param row - The data row containing user information.
     */
    constructor(row: any){
        // Initialize properties
        this.person_id = -1;
        this.name = "";
        this.surname = "";
        this.email = "";
        this.password = "";
        this.pnr = "";
        this.role_id = -1;
        this.username = "";
        this.competencies = [];
        this.availability = [];

        try {
            // Set properties from the data row
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

    /**
     * DO NOT USE. DEPRECATED.
     * Creates a new User instance with competencies.
     * @param result - The result containing user and competency information.
     * @returns A Promise that resolves to a User instance.
     * @deprecated This method is deprecated.
     */
    static async createWithCompetencies(result: any): Promise<User> {
        if(result == null || result.rows == null){ throw new Error("Missing data. Skipping this person."); }
    
        const user = new User(result.rows[0]);

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

/**
 * Sanitizes the User object by removing the password.
 * @param user - The User object to sanitize.
 * @returns The sanitized User object.
 */
export const sanitizeUser = (user: User): User => {
    const sanitizedUser = user;
    sanitizedUser.password = '';
    return sanitizedUser;
};

