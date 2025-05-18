import { Router } from 'express';
import { getClimaByMontana } from '../controllers/clima.controller';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';

const router = Router();

// Ruta para obtener todos los climas
router.post('/all',sanitizeInputs, getClimaByMontana);

export default router;