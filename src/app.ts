import express, { Application } from 'express';
import { loginPerson, registerPerson } from './controllers/personController';
import { validateLogin, validateRegistration } from './middleware/validate';


const app: Application = express();

app.use(express.json());

app.post('/register', validateRegistration, registerPerson);
app.post('/login', validateLogin, loginPerson);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
