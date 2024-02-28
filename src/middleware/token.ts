import jwt from "jsonwebtoken";
import { User } from "../model/User";

/**
 * Create a token for the given user and return it.
 * 
 * @param user - The user to create a token for
 * @returns - The created token
 */
export function createToken(user: User) {
    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign(
        { person_id: user.person_id, username: user.username },
        secretKey,
        { expiresIn: '24h' } // Token expires in 24 hours
    );
    return token;
}

/**
 * Get the user from the token and return it.
 * 
 * @param token  - The token to get the user from
 * @returns - The user
 */
export function getUserFromToken(token: string) {
    const secretKey = process.env.JWT_SECRET as string;
    const decodedToken = jwt.verify(token, secretKey) as { person_id: number; username: string; };
    return decodedToken;
}
