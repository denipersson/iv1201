import { Request, Response } from 'express';
import { createPerson } from '../dao/peronDAO'; 

export const registerPerson = async (req: Request, res: Response) => {
    const { name, surname, pnr, email, password, role_id, username } = req.body;


    try {
        const newPerson = await createPerson(name, surname, pnr, email, password, role_id, username);
        res.status(201).json({ message: "Registration successful", personId: newPerson.person_id });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ error: "Registration failed", details: errorMessage });
    }
    
};

export const loginPerson = (req: Request, res: Response) => {
    // Get user from res.locals
    const user = res.locals.user;
    if (user) {
        res.status(200).json({ message: "Login successful", userId: user.person_id });
        console.log(user.person_id);
    } else {
        res.status(401).json({ message: "Login failed" });
    }
};



