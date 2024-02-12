import express, { Application } from 'express';
import { getApplicants, loginPerson, registerPerson } from './controllers/personController';
import {getCompetencies, addCompetencyToPerson } from './controllers/competenceController'
import { validateCompetencyAdd, validateLogin, validateRegistration } from './middleware/validate';
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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
