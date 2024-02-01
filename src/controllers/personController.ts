import { Request, Response } from 'express';
import { createPerson } from '../dao/personDAO'; 
import jwt from 'jsonwebtoken';

export const registerPerson = async (req: Request, res: Response) => {
    const { name, surname, pnr, email, password, role_id, username } = req.body;

    try {
        // Since validation has passed, we can proceed to create the new person
        const newPerson = await createPerson(name, surname, pnr, email, password, role_id, username);

        // If creation is successful, respond with a success message
        res.status(201).json({
            message: "Registration successful",
            personId: newPerson.person_id
        });
    } catch (error) {
        // If there's a problem during the creation, log it and respond with an error message
        console.error('Error during registration:', error);
        res.status(500).json({
            message: "Registration failed",
            error: (error as Error).message
        });
    }
};

export const loginPerson = (req: Request, res: Response) => {
    const user = res.locals.user; // The user object should be set by `validateLogin` middleware
    if (user) {
        // Create token
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';
        const token = jwt.sign(
            { userId: user.person_id, username: user.username },
            secretKey,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        // Send the token in the response
        res.status(200).json({ message: "Login successful", token: token });
    } else {
        res.status(401).json({ message: "Login failed" });
    }
};



