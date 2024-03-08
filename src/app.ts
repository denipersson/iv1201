

import express, { Application } from 'express';
import { getApplicants } from './controllers/applicantsController';
import { loginPerson, registerPerson } from './controllers/authController';
import { requestPasswordResetLink, resetPassword } from './controllers/resetPasswordController';
import { getCompetencies, addCompetencyToPerson } from './controllers/competenceController';
import { validateLogin, validateRegistration } from './middleware/validateAuth';
import { validateCompetencyAdd } from './middleware/validateCompetency';
import { validatePasswordReset, validatePasswordResetLinkRequest } from './middleware/validatePasswordReset';
import { getUsersWithBadData } from './controllers/dbCleaningController';
import * as dotenv from 'dotenv';
import { validateAdmin, validateAdminOrOwner, validateUser } from './middleware/validateAdmin';
import { validateAvailabilityAdd } from './middleware/validateAvailability'
import { addAvailability, getAvailability } from './controllers/availabilityController'

const cors = require('cors');


/**
 * The main application file for the IV1201 project.
 */

// cors should allow http://localhost:3001 as well as https://frontend-iv-1201.vercel.app/ to access the server
// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3001', 'https://frontend-iv-1201.vercel.app'], // Allow the frontend to access this server
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

dotenv.config(); // Load environment variables from .env file, which will be ignored by Git. In this file we will store sensitive information like database credentials and JWT secret key

const app: Application = express();
app.use(cors(corsOptions));
app.use(express.json());

/**
 * Endpoint for user registration.
 * @route POST /register
 */
app.post('/register', validateRegistration, registerPerson);

/**
 * Endpoint for user login.
 * @route POST /login
 */
app.post('/login', validateLogin, loginPerson);

/**
 * Endpoint for retrieving applicants.
 * @route GET /getApplicants
 */
app.get('/getApplicants', validateAdmin, getApplicants);

/**
 * Endpoint for adding a competency to a person.
 * @route POST /addCompetencyToPerson
 */
app.post('/addCompetencyToPerson', validateAdminOrOwner, validateCompetencyAdd, addCompetencyToPerson);

/**
 * Endpoint for retrieving competencies.
 * @route GET /getCompetencies
 */
app.get('/getCompetencies', validateAdminOrOwner, getCompetencies);

/**
 * Endpoint for resetting a user's password.
 * @route POST /resetPassword
 */
app.post('/resetPassword', validatePasswordReset, resetPassword);

/**
 * Endpoint for requesting a password reset link.
 * @route GET /requestPasswordResetLink
 */
app.get('/requestPasswordResetLink', validatePasswordResetLinkRequest, requestPasswordResetLink);

/**
 * Endpoint for adding availability for a person.
 * @route POST /addAvailability
 */
app.post('/addAvailability', validateAdminOrOwner, validateAvailabilityAdd, addAvailability);

/**
 * Endpoint for getting availability for a person.
 * @route get /getAvailability
 */
app.get('/getAvailability', validateUser, getAvailability);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Perform database cleaning
  await getUsersWithBadData('unencrypted'); // can be: password, unencrypted, email, username

});
