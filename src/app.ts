import express, { Application } from 'express';
import { getApplicants } from './controllers/applicantsController';
import { loginPerson, registerPerson } from './controllers/authController';
import { requestPasswordResetLink, resetPassword } from './controllers/resetPasswordController';
import {getCompetencies, addCompetencyToPerson } from './controllers/competenceController'
import { validateLogin, validateRegistration } from './middleware/validateAuth';
import { validateCompetencyAdd } from './middleware/validateCompetency';
import { validatePasswordReset, validatePasswordResetLinkRequest } from './middleware/validatePasswordReset';
import { getUsersWithBadData } from './controllers/dbCleaningController';
import * as dotenv from 'dotenv';
import { validateAdmin, validateAdminOrOwner } from './middleware/validateAdmin';


const cors = require('cors');

// getCompetencies  addCompetencyToPerson
const corsOptions = {
  origin: 'http://localhost:3001', // This should match the domain of your frontend application
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

dotenv.config(); // Load environment variables from .env file, which will be ignored by Git. In this file we will store sensitive information like database credentials and JWT secret key

const app: Application = express();
app.use(cors(corsOptions));
app.use(express.json());

app.post('/register', validateRegistration, registerPerson);
app.post('/login', validateLogin, loginPerson);
app.get('/getApplicants', validateAdmin, getApplicants);
app.post('/addCompetencyToPerson',validateAdminOrOwner, validateCompetencyAdd, addCompetencyToPerson);
app.get('/getCompetencies', validateAdminOrOwner,  getCompetencies); 
app.post('/resetPassword', validatePasswordReset, resetPassword);
app.get('/requestPasswordResetLink', validatePasswordResetLinkRequest, requestPasswordResetLink)

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    await getUsersWithBadData('unencrypted'); // can be: password, unencrypted, email, username
});
