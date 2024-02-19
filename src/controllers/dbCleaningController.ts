import { findUsersWithNoPassword, findUsersWithoutEmail, findUsersWithoutUsernames, findUsersWithUnencryptedPassword, encryptUnencryptedPasswords, emailPeopleWithNoUsername, emailPasswordResetLinks } from '../dao/databaseCleaningDAO';

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
                return //res.status(400).send({ message: 'Invalid query parameter value for type. Please use one of the following: password, email, username.' });
        }

        if (users.length > 0) {
            if (type == 'unencrypted')
                console.log(`Successfully found users with ${type} issues and changed ${users.length} users`);
            //res.status(200).send({ message: `Successfully found users with ${type} issues and changed ${users.length} users` });
            else
                console.log(`Successfully found users with ${type} issues and notified ${users.length}`);
            // res.status(200).send({ message: `Successfully found users with ${type} issues and notified ${users.length}` });
        }
        else
        console.log(`No users found  with ${type} issues`);
           // res.status(200).send({ message: `No users found  with ${type} issues` });
    } catch (error) {
        console.error(`Error getting users with issues:`, error);
        // res.status(500).send({ message: `Failed to get users with ${req.query.type} issues` });
    }
};


