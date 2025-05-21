import { Router } from 'express';
import { getAllProductos,createProductos, editProductos, desactivarProductos, activarProductos } from '../controllers/productos.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { uploadProductos } from '../middlewares/uploadProductos.middleware.js';
import { create } from 'domain';

const router = Router();

// Ruta para obtener todos los productos
router.get('/all', authenticateUser, getAllProductos);

// Ruta para crear un producto
router.post('/create', uploadProductos.single('imagen'),sanitizeInputs, authenticateUser, createProductos);

// Ruta para editar un producto
router.patch('/edit',uploadProductos.single('imagen') , sanitizeInputs, authenticateUser, editProductos);

// Ruta para eliminar un producto
router.patch('/delete', sanitizeInputs, authenticateUser, desactivarProductos);

// Ruta para activar un producto
router.patch('/activate', sanitizeInputs, authenticateUser, activarProductos);


export default router;