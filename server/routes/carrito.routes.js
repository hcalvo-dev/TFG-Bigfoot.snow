import { Router } from 'express';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { reservarClase, reservarProducto,reservasActivas, deleteReserva, realizarPagoCarrito } from '../controllers/carrito.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();

router.post('/reservaClase', sanitizeInputs, reservarClase);

router.post('/reservaProducto', sanitizeInputs, reservarProducto);

// Ruta para comprobar las reservas activas
router.get('/reservasActivas', sanitizeInputs, reservasActivas);

// Ruta para eliminar una reserva
router.post('/deleteReserva', sanitizeInputs, deleteReserva);

router.post('/realizarPagoCarrito', sanitizeInputs, authenticateUser, realizarPagoCarrito);


export default router;