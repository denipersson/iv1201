import express, { Application } from 'express';
import { loginPerson, registerPerson } from './controllers/personController';
import { validateLogin, validateRegistration } from './middleware/validate';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file, which will be ignored by Git. In this file we will store sensitive information like database credentials and JWT secret key

const app: Application = express();

app.use(express.json());

app.post('/register', validateRegistration, registerPerson);
app.post('/login', validateLogin, loginPerson);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
