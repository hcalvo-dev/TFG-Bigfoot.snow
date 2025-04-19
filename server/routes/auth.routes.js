import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

// Ruta privada de ejemplo
router.get('/privado', authenticateToken, (req, res) => {
    res.json({ message: 'Estás autenticado 🔐' });
  });
  

export default router;