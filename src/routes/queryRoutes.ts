import { Router } from 'express';
import QueryController from '../controllers/QueryController';

const router = Router();

router.get('/query', QueryController.handleQuery);

export default router;
