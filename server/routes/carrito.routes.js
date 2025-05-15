import { Router } from 'express';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { reservarClase } from '../controllers/carrito.controller';

const router = Router();

router.post('/reservaClase', sanitizeInputs, reservarClase);


export default router;