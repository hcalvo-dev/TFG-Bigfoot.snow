import { Router } from 'express';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { reservarClase, reservarProducto,reservasActivas, deleteReserva } from '../controllers/carrito.controller';

const router = Router();

router.post('/reservaClase', sanitizeInputs, reservarClase);

router.post('/reservaProducto', sanitizeInputs, reservarProducto);

// Ruta para comprobar las reservas activas
router.get('/reservasActivas', sanitizeInputs, reservasActivas);

// Ruta para eliminar una reserva
router.post('/deleteReserva', sanitizeInputs, deleteReserva);


export default router;