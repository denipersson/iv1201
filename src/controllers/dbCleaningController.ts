import { findUsersWithNoPassword, findUsersWithoutEmail, findUsersWithoutUsernames, findUsersWithUnencryptedPassword, encryptUnencryptedPasswords, emailPeopleWithNoUsername, emailPasswordResetLinks } from '../dao/databaseCleaningDAO';

/**
 * Controller for getting users with bad data.
 * @param type The type of issue to look for. Can be password, email, username or unencrypted. 
 */
export const getUsersWithBadData = async (type: string) => {
    try {
        let users = [];
        // Determine the type of issue and call the appropriate DAO function
        switch (type) {
            case 'password':
                users = await findUsersWithNoPassword();
                await emailPasswordResetLinks(users);
                break;
            case 'unencrypted':
                users = await findUsersWithUnencryptedPassword();
                await encryptUnencryptedPasswords(users);
                break;
            case 'email':
                users = await findUsersWithoutEmail();
                break;
            case 'username':
                users = await findUsersWithoutUsernames();
                await emailPeopleWithNoUsername(users);
                break;
            default:
                return "Invalid query parameter value for type. Please use one of the following: password, email, username.";
        }

        if (users.length > 0) {
            if (type == 'unencrypted')
                console.log(`Successfully found users with ${type} issues and changed ${users.length} users`);
            else
                console.log(`Successfully found users with ${type} issues and notified ${users.length}`);
        }
        else
        console.log(`No users found  with ${type} issues`);

    } catch (error) {
        console.error(`Error getting users with issues:`, error);

    }
};


