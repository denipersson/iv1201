import jwt from "jsonwebtoken";
import { User } from "../model/User";

export function createToken(user: User) {
    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign(
        { person_id: user.person_id, username: user.username },
        secretKey,
        { expiresIn: '24h' } // Token expires in 24 hours
    );
    return token;
}
export function getUserFromToken(token: string) {
    const secretKey = process.env.JWT_SECRET as string;
    const decodedToken = jwt.verify(token, secretKey) as { person_id: number; username: string; };
    return decodedToken;
}

export function generatePasswordResetToken(user: User) {
    const username = user.username;
    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign({ username }, secretKey, { expiresIn: '15m' });
    return token;
}
