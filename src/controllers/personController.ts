import { Request, Response } from 'express';
import { createPerson, findApplicants } from '../dao/personDAO'; 
import { User, sanitizeUser } from '../model/User';
import { createToken } from '../middleware/token';

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
    const user: User = res.locals.user;
    if (user) {
        // Create token
        const secretKey = process.env.JWT_SECRET as string;
        const token = createToken(user);

        // Send the token in the response
        res.status(200).json({ message: "Login successful", user: user, token: token });
    } else {
        res.status(401).json({ message: "Login failed" });
    }
};

export const getApplicants = async (req: Request, res: Response) => {
    try {
        const applicants = await findApplicants();
        for (let i = 0; i < applicants.length; i++) {
            applicants[i] = sanitizeUser(applicants[i]);
        }
        res.status(200).json(applicants);
    } catch (error) {
        console.error('Error during applicant retrieval:', error);
        res.status(500).json('An error occurred during applicant retrieval');
    }
};



