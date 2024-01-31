import { Request, Response } from 'express';
import { query } from '../db';

class QueryController {
    static async handleQuery(req: Request, res: Response) {
        const { type } = req.query;
        let sql = '';
        switch (type) {
            case 'UsersRoles':
                sql = 'SELECT Name, Email, Role FROM Users;';
                break;
            case 'CompetenceProfiles':
                sql = `
                SELECT u.Name, cp.Skill, cp.ExperienceLevel
                FROM Users u
                JOIN CompetenceProfiles cp ON u.UserID = cp.UserID;
                `;
                break;
            case 'UpcomingInterviews':
                sql = `
                SELECT i.InterviewID, u1.Name AS ApplicantName, u2.Name AS InterviewerName, i.InterviewDate
                FROM Interviews i
                JOIN Applications a ON i.ApplicationID = a.ApplicationID
                JOIN Users u1 ON a.UserID = u1.UserID
                JOIN Users u2 ON i.InterviewerID = u2.UserID
                WHERE i.InterviewDate > CURRENT_DATE;
                `;
                break;

            default:
                return res.status(400).send('Invalid query type');
        }

        try {
            const result = await query(sql);
            res.json(result.rows);
        } catch (err) {
            const error = err as Error;
            console.error('Error occurred:', error.message);
            res.status(500).send('Server error');
        }
    }
}

export default QueryController;
