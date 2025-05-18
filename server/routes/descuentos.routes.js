import { Router } from 'express';
import { getAllDescuentos } from '../controllers/descuentos.controller';

const router = Router();

// Ruta para obtener todos los descuentos
router.get('/all', getAllDescuentos);

export default router;