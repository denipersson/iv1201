
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { findPersonByEmail, findPersonByUsername } from '../dao/personDAO';

/**
 * Middleware function to validate user registration data.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction object.
 */
export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
    const { name, surname, pnr, email, password, role_id, username } = req.body;

    // Check if all fields are present
    if (!name || !surname || !pnr || !email || !password || !username) {
        console.log(name, surname, pnr, email, password, role_id, username);
        return res.status(400).json({ message: "All fields are required" });
    }

    // Regular expression patterns for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pnrRegex = /^[0-9]{10,12}$/; // This pattern is a simple example, adjust according to your actual personal number format

    // Validate email format
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate personal number format
    if (!pnrRegex.test(pnr)) {
        return res.status(400).json({ message: 'Invalid personal number format' });
    }

    try {
        // Check if email or username already exists in the database
        const emailExists = await findPersonByEmail(email);
        if (emailExists) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const usernameExists = await findPersonByUsername(username);
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already in use' });
        }

        // If all checks pass, move to the next middleware (which will be your registerPerson controller)
        next();
    } catch (error) {
        // If an error occurs during the database checks, pass it to the error-handling middleware
        next(error);
    }
};

/**
 * Middleware function to validate user login data.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction object.
 */
export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const person = await findPersonByUsername(username);
        if (!person) {
            return next(new Error('User not found'));
        }

        const passwordIsValid = await bcrypt.compare(password, person.password);
        if (!passwordIsValid) {
            return next(new Error('Invalid credentials'));
        }

        res.locals.user = person;

        next();
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login validation" });
    }
};
