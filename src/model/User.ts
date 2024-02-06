// User.ts
export interface User {
    person_id: number;
    name: string;
    surname: string;
    pnr: string;
    email: string;
    password: string;
    role_id: number;
    username: string;
}

// Set User's password to '' when sending it to the client
export const sanitizeUser = (user: User): User => {
    return {
        person_id: user.person_id,
        name: user.name,
        surname: user.surname,
        pnr: user.pnr,
        email: user.email,
        password: '',
        role_id: user.role_id,
        username: user.username
    };
};
