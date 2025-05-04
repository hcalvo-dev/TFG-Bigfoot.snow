import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { logoutUser } from '../controllers/logoutUser.controller';
import { getCurrentUser } from '../controllers/getCurrentUser.controller';
import { app } from '../index';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';

const router = Router();

router.post('/login', sanitizeInputs, loginUser);
router.post('/register',sanitizeInputs, registerUser);
router.post('/logout', logoutUser);

router.get('/me', authenticateUser, getCurrentUser);

// Ruta privada de ejemplo
router.get('/privado', authenticateUser, (req, res) => {
    res.json({ message: 'Estás autenticado 🔐' });
  });
  

export default router;