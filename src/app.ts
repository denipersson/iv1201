import express, { Application } from 'express';
import { loginPerson, registerPerson } from './controllers/personController';
import { validateLogin, validateRegistration } from './middleware/validate';
import * as dotenv from 'dotenv';

const cors = require('cors');


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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
