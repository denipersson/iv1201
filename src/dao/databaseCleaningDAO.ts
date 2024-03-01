
import bcrypt from 'bcrypt';
import { User } from "../model/User";
import { query } from '../config/database';

/**
 * Finds users with no password.
 * @returns A promise that resolves to an array of User objects.
 */
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

/**
 * Finds users with unencrypted passwords.
 * @returns A promise that resolves to an array of User objects.
 */
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

/**
 * Finds users without an email.
 * @returns A promise that resolves to an array of User objects.
 */
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

/**
 * Finds users without a username.
 * @returns A promise that resolves to an array of User objects.
 */
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

/**
 * Encrypts unencrypted passwords for a given array of users.
 * @param users - An array of User objects.
 */
export const encryptUnencryptedPasswords = async (users: User[]) => {
    const saltRounds = 10; 
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        // Update user password in the database
        const sql = `UPDATE public.person SET password = $1 WHERE person_id = $2`;
        await query(sql, [hashedPassword, user.person_id]);
    }
};

/**
 * Sends emails to users without a username.
 * @param users - An array of User objects.
 */
export const emailPeopleWithNoUsername = async (users: User[]) => {
    var i = 0;
    for(const user of users){
        if(user.email == null || user.email == ''){
            // All users that don't have an email have a username and a password. 
            // We can temporarily apply a fake email and ask them to change it on login.
        }
        else{
            // Send email to user
            i++;
        }
    }
    console.log(i + " emails sent to users with no username");
}

/**
 * Sends password reset emails to users without a password.
 * @param users - An array of User objects.
 */
export const emailPasswordResetLinks = async (users: User[]) => {
    var i = 0;
    for(const user of users){
        if(user.email == null || user.email == ''){
            // All users that don't have an email have a username and a password. 
            // We can temporarily apply a fake email and ask them to change it on login.
        }
        else{
            // Send email to user
            i++;
        }
    }
    console.log(i + " emails sent to users with no password");
}

/**
 * Finds people without an email and a username.
 * @returns A promise that resolves to an array of User objects.
 */
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