import { Router } from 'express';
import { getAllProductos, editProductos, desactivarProductos, activarProductos } from '../controllers/productos.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';

const router = Router();

// Ruta para obtener todos los productos
router.get('/all', authenticateUser, getAllProductos);

// Ruta para editar un producto
router.patch('/edit',sanitizeInputs, authenticateUser, editProductos);

// Ruta para eliminar un producto
router.patch('/delete', sanitizeInputs, authenticateUser, desactivarProductos);

// Ruta para activar un producto
router.patch('/activate', sanitizeInputs, authenticateUser, activarProductos);


export default router;