import express from 'express';
import { registerPerson, loginPerson } from '../controllers/personController';
import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware'; 

const router = express.Router();

// Register route
router.post('/register', validateRegistration, registerPerson);

// Login route
router.post('/login', validateLogin, loginPerson);


export default router;
