import { Router } from 'express';
import { getRoles } from '../controllers/roles.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();

// Ruta para obtener el usuario actual
router.get('/get-Roles', authenticateUser, getRoles);

export default router;