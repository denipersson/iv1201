import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/addUser', UserController.addUser);

export default router;
