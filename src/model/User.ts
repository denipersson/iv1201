// User.ts
export class User {
    name: string;
    surname: string;
    email: string;
    competencies: Array<string>;
    pnr: string;
    username: string;
    password: string;
    id: string;

    //checks email, but needs to be done frontend too.
    private isValid(): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(this.email);
    }
    constructor(result: any){
        const row = result.rows[0];

            this.name = row.name;
            this.surname = row.surname;
            this.email = row.email;
            this.competencies = row.competencies;
            this.pnr = row.pnr;
            this.username = row.username;
            this.password = row.password;
            this.id = row.id;
        }
    }
}

// Set User's password to '' when sending it to the client
export const sanitizeUser = (user: User): User => {
    const sanitizedUser = user;
    sanitizedUser.password = '';
    return sanitizedUser;
};
