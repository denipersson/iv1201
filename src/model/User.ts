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
    const sanitizedUser = user;
    sanitizedUser.password = '';
    return sanitizedUser;
};
