import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { logoutUser } from '../controllers/logoutUser.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { capitalizeNombre } from '../middlewares/capitalizeFields';

const router = Router();

// Rutas de autenticación
router.post('/login', sanitizeInputs, loginUser);
router.post('/register', sanitizeInputs, capitalizeNombre, registerUser);
router.post('/logout', authenticateUser, logoutUser);



export default router;
