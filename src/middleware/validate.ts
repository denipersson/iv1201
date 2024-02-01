import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { findPersonByEmail, findPersonByUsername } from '../dao/personDAO';


export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!email || !password || !username) {
    //     return res.status(400).json({ message: "Email, password, and username are required" });
    // }

    if (!emailRegex.test(email)) {
        return next(new Error('Invalid email format'));
      }

    try {
        const emailExists = await findPersonByEmail(email);
        if (emailExists) {
            return next(new Error('Email is already in use')); //need to send with an error so register fails. Error will be caught in controller
        }

        const usernameExists = await findPersonByUsername(username);
        if (usernameExists) {
            return next(new Error('Username is already in use'));
        }

        next();
    } catch (error) {
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


