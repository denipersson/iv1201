import { Request, Response, response } from 'express';
import { getApplicantsDAO } from '../dao/personDAO'; 
import { User, sanitizeUser as sanitizeUsers } from '../model/User';

export const getApplicants = async (req: Request, res: Response) => {
    try {
        let applicants: User[] = await getApplicantsDAO() as User[];

        for (let i = 0; i < applicants.length; i++) {
            applicants[i] = sanitizeUsers(applicants[i]);
        }

        res.status(200).json(applicants);
    } catch (error) {
        console.error('Error during applicant retrieval:', error);
        res.status(500).json('An error occurred during applicant retrieval');
    }
};






