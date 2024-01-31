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

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // validate data...

        // get user from database
        // const user = await database.getUserByEmail(email);

        // compare passwords
        // const match = await bcrypt.compare(password, user.password);

        // if (!match) {
        //     res.status(401).json({ message: "Incorrect password!" });
        //     return;
        // }

        res.status(200).json({ message: "User logged in!" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred when attempting to log in user: " + error });
    }
}
