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


// validate that the token is valid and also that the user is either an admin or the owner of the competencies. slightly stolen from deni, but i neded to add it 
export const validateAdminOrOwner = async (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;

    if (!headers) {
        return res.status(400).json('Headers missing');
    }

    const token = headers['token'] as string;
    const username = headers['username'] as string;

    if (!token) {
        return res.status(401).json('Token or username missing in headers');
    }
    const check = validateToken(token);


    if (!check.valid) {
        return res.status(401).json('Invalid token');
    }

    const userInfo = getUserFromToken(token);

    // Find user role by username
      const user = await findPersonByUsername(userInfo.username).catch((error) => {
        console.error('Error during user retrieval:', error);
        res.status(500).json('An error occurred during user retrieval');
    });

    if (!user) {
        return res.status(404).json('User not found');
    }

    // first check. admin just approved. 
    if (user.role_id == 1) {
        console.log('User is an admin');
        next();
        return;
    }

    // If not an admin, check if the user is accessing their own data
    if (username === userInfo.username) {
        console.log('User is accessing their own data');
        next();
    } else {
        res.status(403).json('User is not authorized to access this data');
    }
};
