import express, { Application } from 'express';
import { registerUser, loginUser } from './controllers/userController';
import { validateRegister } from './middleware/validateRegister';
import { validateLogin } from './middleware/validateLogin';

const app: Application = express();

app.use(express.json());

app.post('/register', validateRegister, registerUser);
app.post('/login', validateLogin, loginUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
