import { Router } from 'express';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { reservarClase, reservarProducto } from '../controllers/carrito.controller';

const router = Router();

router.post('/reservaClase', sanitizeInputs, reservarClase);

router.post('/reservaProducto', sanitizeInputs, reservarProducto);


export default router;