import { User } from "../model/User";
import { query } from '../config/database';


export const findUsersWithBadData = async (): Promise<User[]> => {
    try {
        // find users without passwords or with unencrypted passwords, chatgptd the sql query i have no clue why it works
        let sql = `SELECT * FROM public.person WHERE password IS NULL OR password NOT LIKE '$2a$%' AND password NOT LIKE '$2b$%' AND password NOT LIKE '$2x$%' AND password NOT LIKE '$2y$%' AND password NOT LIKE '$2$%';`;
        const usersWithBadPassword = await query(sql);

        // without emails
        sql = `SELECT * FROM public.person WHERE email IS NULL OR email = '';`;
        const usersWithoutEmail = await query(sql);

        // no username
        sql = `SELECT * FROM public.person WHERE email IS NULL OR email = '';`;
        const usersWithoutUsernames = await query(sql);
        const users = [...usersWithBadPassword.rows, ...usersWithoutEmail.rows, ...usersWithoutUsernames.rows];

        return users;
    } catch (error) {
        console.error('Failed to find users with bad data:', error);
        throw error;
    }
}