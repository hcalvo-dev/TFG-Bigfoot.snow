import { Router } from 'express';
import { getRutasByNombre } from '../controllers/rutas.controller';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';

const router = Router();

// Ruta para obtener todas las rutas por nombre
router.post('/all',sanitizeInputs, getRutasByNombre);

export default router;