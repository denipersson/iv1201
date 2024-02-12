import { Request, Response, NextFunction } from 'express';
import { validateToken } from "./validate";
import { findPersonByUsername } from '../dao/personDAO';
import { getUserFromToken } from './token';

// validate that the token is valid and also that the user is an admin

export const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;

    if(!headers) {
        return res.status(401).json('Headers missing');
    }

    // The frontend sends a get request containing the token in the header, as well as the username
    const token = headers['token'] as string;
    const userInfo = getUserFromToken(token);
    const username = userInfo.username;

    if (!token) {
        return res.status(401).json('Headers missing');
    }
    const check = validateToken(token);
    if (!check.valid) {
        return res.status(401).json('Invalid token');
    }
    findPersonByUsername(username).then((user) => {
        if (!user) {
            return res.status(404).json('User not found');
        }

        if (user.role_id != 1) {
            return res.status(401).json('User is not an admin');
        }
        console.log('User is an admin');
        next();
    }).catch((error) => {
        console.error('Error during admin validation:', error);
        res.status(500).json('An error occurred during admin validation');
    });
}

export const validateAdminOrOwner = async (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;

    if (!headers) {
        return res.status(401).json('Headers missing');
    }

    const token = headers['token'] as string;

    if (!token) {
        return res.status(401).json('Token missing in headers');
    }

    const check = validateToken(token);
    if (!check.valid) {
        return res.status(401).json('Invalid token');
    }

    const userInfo = getUserFromToken(token);
    const { requestedUsername } = req.body; //get the requested username
    console.log(requestedUsername);

    findPersonByUsername(userInfo.username).then((user) => {
        if (!user) {
            return res.status(404).json('User not found');
        }

        // User is an admin or the requested username matches the token username
        if (user.role_id === 1 || userInfo.username === requestedUsername) {
            console.log(`${userInfo.username} is an admin or accessing their own data`);
            next();
        } else {
            return res.status(403).json('User is not authorized to access this data');
        }
    }).catch((error) => {
        console.error('Error during user validation:', error);
        res.status(500).json('An error occurred during user validation');
    });
};