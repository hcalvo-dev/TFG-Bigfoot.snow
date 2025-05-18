import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { logoutUser } from '../controllers/logoutUser.controller';
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} from '../controllers/currentUser.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { capitalizeNombre } from '../middlewares/capitalizeFields';

const router = Router();

// Rutas de autenticación
router.post('/login', sanitizeInputs, loginUser);
router.post('/register', sanitizeInputs, capitalizeNombre, registerUser);
router.post('/logout', logoutUser);

// Ruta privada de ejemplo
router.get('/privado', authenticateUser, (req, res) => {
  res.json({ message: 'Estás autenticado 🔐' });
});

export default router;
