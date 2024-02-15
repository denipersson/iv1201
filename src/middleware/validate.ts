import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { findPersonByEmail, findPersonByUsername } from '../dao/personDAO';
import jwt from 'jsonwebtoken';
import { getUserFromToken } from './token';

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

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const person = await findPersonByUsername(username);
        console.log("test");
        if (!person) {
            return next(new Error('User not found'));
           // return res.status(404).json({ message:  });
        }

        const passwordIsValid = await bcrypt.compare(password, person.password);
        if (!passwordIsValid) {
            return next(new Error('Invalid credentials'));
            //return res.status(401).json({ message: "Invalid credentials" });
        }


        res.locals.user = person;

        next();
    } catch (error) {
       // console.error('Error during login validation:', error);
        res.status(500).json({ message: "An error occurred during login validation" });
    }
};

// Function to validate a token - this will be used in a middleware to protect routes that require a valid session
export const validateToken = (token: string): { valid: boolean; decoded?: any } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false };
  }
};

export const validateCompetencyAdd = async (req: Request, res: Response, next: NextFunction) => {
    const { requestedUsername, competencyName, yearsOfExperience } = req.body;

    // Basic validation for input presence
    if (!requestedUsername || !competencyName || yearsOfExperience === undefined) {
        return res.status(400).json({ message: "Username, competency name, and years of experience are required" });
    }

    // Additional validations can be added here, maybe yearsOfExperience is number?

    try {
        const person = await findPersonByUsername(requestedUsername);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        
        res.locals.personId = person.person_id;
        next();
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};



