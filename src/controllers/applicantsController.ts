
import { Request, Response, response } from 'express';
import { getApplicantsDAO } from '../dao/personDAO'; 
import { User, sanitizeUser as sanitizeUsers } from '../model/User';
/**
 * Retrieves the list of applicants.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON array of User objects representing the applicants.
 */
export const getApplicants = async (req: Request, res: Response) => {
    try {
        let applicants: User[] = await getApplicantsDAO() as User[];

        for (let i = 0; i < applicants.length; i++) {
            applicants[i] = sanitizeUsers(applicants[i]);
        }

        console.log('Applicants retrieved');
        res.status(200).json(applicants);
    } catch (error) {
        console.error('Error during applicant retrieval:', error);
        res.status(500).json('An error occurred during applicant retrieval');
    }
};






