import { Router } from 'express';
import { getAllProductos } from '../controllers/productos.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';

const router = Router();

// Ruta para obtener todos los productos
router.get('/all', authenticateUser, getAllProductos);


export default router;