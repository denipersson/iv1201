import jwt from "jsonwebtoken";
import { User } from "../model/User";

export function createToken(user: User) {
    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign(
        { userId: user.person_id, username: user.username },
        secretKey,
        { expiresIn: '24h' } // Token expires in 24 hours
    );
    return token;
}
export function getUserFromToken(token: string) {
    const secretKey = process.env.JWT_SECRET as string;
    const decodedToken = jwt.verify(token, secretKey) as { userId: number; username: string; };
    return decodedToken;
}
