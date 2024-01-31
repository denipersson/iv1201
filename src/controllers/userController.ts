import { Request, Response } from 'express';
const bcrypt = require('bcrypt');

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // validate data...

        const hashedPassword = await bcrypt.hash(password, 10);

        // save user in database
        // await database.createUser(username, email, hashedPassword);

        res.status(201).json({ message: "User created!" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred when attempting to create user: " + error });
    }
};
