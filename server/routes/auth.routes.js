import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';


const router = Router();

router.post('/login', sanitizeInputs, loginUser);
router.post('/register',sanitizeInputs, registerUser);

router.get('/me', authenticateToken, (req, res) => {
  const user = res.locals.user;
  res.json({ user }); 
});

// Ruta privada de ejemplo
router.get('/privado', authenticateToken, (req, res) => {
    res.json({ message: 'Estás autenticado 🔐' });
  });
  

export default router;