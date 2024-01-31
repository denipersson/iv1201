import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db';

class UserController {
    static async addUser(req: Request, res: Response) {
        try {
            const { email, password, role, name, contactInfo } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = `
                INSERT INTO Users (Email, Password, Role, Name, ContactInfo) VALUES
                ($1, $2, $3, $4, $5);
            `;
            const result = await query(sql, [email, hashedPassword, role, name, contactInfo]);
            res.json({ message: 'User added successfully', data: result });
        } catch (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Server error');
        }
    }
}

export default UserController;
