import bcrypt from 'bcrypt';
import { User } from "../model/User";
import { query } from '../config/database';

export const findUsersWithNoPassword = async (): Promise<User[]> => {
    try {
        const sql = `SELECT *
        FROM public.person
        WHERE password IS NULL;`;
        const result = await query(sql); 
        return result.rows;
    } catch (error) {
        console.error('Failed to find users with unencrypted or no password:', error);
        throw error;
    }
};

export const findUsersWithUnencryptedPassword = async (): Promise<User[]> => {
    try {
        const sql = `SELECT *
        FROM public.person
        WHERE password IS NOT NULL AND (
            password NOT LIKE '$2a$%' AND
            password NOT LIKE '$2b$%' AND
            password NOT LIKE '$2x$%' AND
            password NOT LIKE '$2y$%' AND
            password NOT LIKE '$2$%'
        );`;
        const result = await query(sql); 
        if(result.rowCount==0){
            console.log("All users have encrypted password");
        }
        return result.rows;
    } catch (error) {
        console.error('Failed to find users with unencrypted or no password:', error);
        throw error;
    }
};

export const findUsersWithoutEmail = async (): Promise<User[]> => {
    try {
        const sql = `SELECT * FROM public.person WHERE email IS NULL OR email = '';`;
        const result = await query(sql);
        return result.rows;
    } catch (error) {
        console.error('Failed to find users without email:', error);
        throw error;
    }
};

export const findUsersWithoutUsernames = async (): Promise<User[]> => {
    try {
        const sql = `SELECT * FROM public.person WHERE username IS NULL OR username = '';`;
        const result = await query(sql);
        return result.rows;
    } catch (error) {
        console.error('Failed to find users without usernames:', error);
        throw error;
    }
};

export const encryptUnencryptedPasswords = async (users: User[]) => {
    const saltRounds = 10; 
    for (const user of users) {
        //console.log(user.password);
        //console.log(user.person_id);
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        // Update user password in the database
        const sql = `UPDATE public.person SET password = $1 WHERE person_id = $2`;
        await query(sql, [hashedPassword, user.person_id]);
    }
};
export const emailPeopleWithNoUsername = async (users: User[]) => {
    var i = 0;
    for(const user of users){
        if(user.email == null || user.email == ''){
            //all users that dont have email have a username and a password. 
            //we can temporarily apply a fake email- and ask em to change it on login. -e
        }
        else{
            // Send email to user
            //console.log("Email sent to " + user.email + " with no username");
            i++;
        }
    }
    console.log(i + " emails sent to users with no username");
}
    export const emailPasswordResetLinks = async (users: User[]) => {
        // send emails to all users without password- deal with it
        var i = 0;
        for(const user of users){
            if(user.email == null || user.email == ''){
                //all users that dont have email have a username and a password. 
                //we can temporarily apply a fake email- and ask em to change it on login. -e
            }
            else{
                // Send email to user
                //console.log("Email sent to " + user.email + " with no password. Please reset ur password. ");
                i++;
            }
        }
        console.log(i + " emails sent to users with no password");

    }

export const findPeopleWithoutEmailAndUsername = async (): Promise<User[]> => {
    try {
        const sql = `SELECT *
        FROM public.person
        WHERE email IS NULL and email = '' and username IS NULL and username = '';`;
        const result = await query(sql);
        return result.rows;
    } catch (error) {
        console.error('Failed to find people without email and username:', error);
        throw error;
    }
};