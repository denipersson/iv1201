

import { Request, Response } from 'express';
import { findPersonByEmail, updatePersonPassword } from '../dao/personDAO';
import { generatePasswordResetToken, getUserFromToken } from '../helpers/token';
import { Console } from 'console';

/**
 * Resets the password for a user.
 * @param req - The request object.
 * @param res - The response object.
 */
export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = getUserFromToken(token);
        updatePersonPassword(decoded.username, newPassword);

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

/**
 * Sends a password reset link to the user's email.
 * @param req - The request object.
 * @param res - The response object.
 */
export const requestPasswordResetLink = async (req: Request, res: Response) => {
    const headers = req.headers;
    const email = headers['email'] as string;

    try {
        const user = await findPersonByEmail(email);
        if (user) {
            const token = generatePasswordResetToken(user);
            res.status(200).json({ message: "Password reset requested, following token is valid for 15 minutes and would've been sent to user's email: ", token });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Password reset failed" });
    }
};
