import { Router } from 'express';
import { getAllProductos,createProductos, editProductos, desactivarProductos, activarProductos, productosDisponibles, getProductosReservados } from '../controllers/productos.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { uploadProductos } from '../middlewares/uploadProductos.middleware.js';
import { requireAdmin } from '../middlewares/requireAdmin';
import { create } from 'domain';

const router = Router();

// Ruta para obtener todos los productos
router.get('/all', authenticateUser, getAllProductos);

// Ruta para crear un producto
router.post('/create',sanitizeInputs, authenticateUser,requireAdmin, uploadProductos.single('imagen'), createProductos);

// Ruta para editar un producto
router.patch('/edit',sanitizeInputs,authenticateUser,requireAdmin, uploadProductos.single('imagen') , editProductos);

// Ruta para eliminar un producto
router.patch('/delete',sanitizeInputs,authenticateUser,requireAdmin, desactivarProductos);

// Ruta para activar un producto
router.patch('/activate',sanitizeInputs,authenticateUser,requireAdmin, activarProductos);

// Ruta para comprobar la disponibilidad de un producto
router.post('/disponibles',sanitizeInputs, productosDisponibles);

// Ruta para obtener los productos reservados 
router.get('/reservados',sanitizeInputs, authenticateUser, getProductosReservados);


export default router;