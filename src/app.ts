import express, { Application } from 'express';
import { registerUser } from './controllers/userController';
import { validateRegister } from './middleware/validateRegister';

const app: Application = express();

app.use(express.json());

app.post('/register', validateRegister, registerUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
