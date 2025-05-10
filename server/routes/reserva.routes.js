import { Router } from 'express';
import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../controllers/currentUser.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';

const router = Router();



export default router;