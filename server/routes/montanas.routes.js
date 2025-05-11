import { Router } from 'express';
import { getMontanas } from '../controllers/montanas.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/all', getMontanas);

export default router;