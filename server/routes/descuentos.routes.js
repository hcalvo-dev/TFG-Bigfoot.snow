import { Router } from 'express';
import { getAllDescuentos, getAllDescuentosEstados , deleteDescuentos, activarDescuentos, editDescuentos, createDescuentos } from '../controllers/descuentos.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

// Ruta para obtener todos los descuentos
router.get('/all', getAllDescuentos);

// Ruta para obetener todos los descuentos independientemente de su estado
router.get('/allDescuentos',authenticateUser, getAllDescuentosEstados);

// Ruta para eliminar un descuento
router.patch('/delete',authenticateUser,requireAdmin, sanitizeInputs,  deleteDescuentos);

// Ruta para activar un descuento
router.patch('/activate',authenticateUser,requireAdmin, sanitizeInputs, activarDescuentos);

// Ruta para editar un descuento
router.patch('/edit',authenticateUser,requireAdmin, sanitizeInputs, editDescuentos);

// Ruta para crear un descuento
router.post('/create',authenticateUser,requireAdmin, sanitizeInputs, createDescuentos);

export default router;