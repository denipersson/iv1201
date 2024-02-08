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
    const pidHeader = headers['pid'] as string;

    if (!token || !pidHeader) {
        return res.status(401).json('Token or PID missing in headers');
    }

    // validating token. we should probs function this seperately as its gonna get repeated if we keep doing these endpoints. 
    //todo function this section to repeat it.... 
    const check = validateToken(token);
    const userInfo = getUserFromToken(token);

    if (!check.valid || !userInfo) {
        return res.status(401).json('Invalid token');
    }

    const username = userInfo.username;
    const personIDFromHeader = parseInt(pidHeader);

    // Find user role by username
    //same here uwu
      const userRoleData = await findPersonByUsername(username).catch((error) => {
        console.error('Error during user retrieval:', error);
        res.status(500).json('An error occurred during user retrieval');
    });

    if (!userRoleData) {
        return res.status(404).json('User not found');
    }

    // first check. admin just approved. 
    if (userRoleData.role_id === 1) {
        console.log('User is an admin');
        next();
        return;
    }

    if (isNaN(personIDFromHeader)) {
        // If pidHeader is not a valid number
        return res.status(400).json('Invalid PID in the header');
    }

    // If not an admin, check if the user is accessing their own data
    if (userRoleData.person_id === personIDFromHeader) {
        console.log('User is accessing their own data');
        next();
    } else {
        res.status(403).json('User is not authorized to access this data');
    }
};
