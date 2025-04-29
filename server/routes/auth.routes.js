import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';


const router = Router();

router.post('/login', sanitizeInputs, loginUser);
router.post('/register',sanitizeInputs, registerUser);

// Ruta privada de ejemplo
router.get('/privado', authenticateToken, (req, res) => {
    res.json({ message: 'Estás autenticado 🔐' });
  });
  

export default router;