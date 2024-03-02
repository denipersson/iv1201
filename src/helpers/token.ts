

import jwt from "jsonwebtoken";
import { User } from "../model/User";

/**
 * Creates a JWT token for the given user.
 * @param user - The user object.
 * @returns The JWT token.
 */
export function createToken(user: User): string {
    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign(
        { person_id: user.person_id, username: user.username },
        secretKey,
        { expiresIn: '24h' } // Token expires in 24 hours
    );
    return token;
}

/**
 * Retrieves the user information from the given JWT token.
 * @param token - The JWT token.
 * @returns The decoded user information.
 */
export function getUserFromToken(token: string): { person_id: number; username: string; } {
    const secretKey = process.env.JWT_SECRET as string;
    const decodedToken = jwt.verify(token, secretKey) as { person_id: number; username: string; };
    return decodedToken;
}

/**
 * Generates a JWT token for password reset for the given user.
 * @param user - The user object.
 * @returns The JWT token for password reset.
 */
export function generatePasswordResetToken(user: User): string {
    const username = user.username;
    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign({ username }, secretKey, { expiresIn: '15m' });
    return token;
}
