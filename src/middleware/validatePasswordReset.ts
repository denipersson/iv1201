
import { Request, Response, NextFunction } from 'express';
import { findPersonByEmail } from '../dao/personDAO';
import { validateToken } from './validateToken';

/**
 * Middleware function to validate the request for a password reset link.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns A response indicating the status of the request.
 */
export const validatePasswordResetLinkRequest = async (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;

    if(!headers) {
        return res.status(401).json('Headers missing');
    }

    const email = headers['email'] as string;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const person = await findPersonByEmail(email);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.locals.person = person;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware function to validate the password reset request.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns A response indicating the status of the request.
 */
export const validatePasswordReset = (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;


    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }
    if (!validateToken(token).valid) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    next();
};
