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
    constructor(result: any){
        const row = result.rows[0];

        this.name = row.name;
        this.surname = row.surname;
        this.email = row.email;
        //competencies måste dealas med seperat då de inte kommer finnas i user. 
        this.competencies = row.competencies;
        this.pnr = row.pnr;
        this.username = row.username;
        this.password = row.password;
        this.person_id = row.id;
        this.role_id = row.role_id;
    }
}

// Set User's password to '' when sending it to the client
export const sanitizeUser = (user: User): User => {
    const sanitizedUser = user;
    sanitizedUser.password = '';
    return sanitizedUser;
};
