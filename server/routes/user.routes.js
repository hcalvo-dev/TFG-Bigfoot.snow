import { Router } from 'express';
import { getCurrentUser, updateCurrentUser, deleteCurrentUser, allCurrentUser, activateUser } from '../controllers/currentUser.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { capitalizeNombre } from '../middlewares/capitalizeFields';

const router = Router();

// Ruta para obtener el usuario actual
router.get('/me', authenticateUser, getCurrentUser);

// Ruta para actualizar el usuario actual
router.patch('/update',sanitizeInputs, capitalizeNombre, authenticateUser, updateCurrentUser);

// Ruta para eliminar el usuario actual
router.patch('/delete',sanitizeInputs, authenticateUser, deleteCurrentUser);

// Ruta para reactivar el usuario
router.patch('/activate', sanitizeInputs, authenticateUser, activateUser);

// Ruta para obtener todos los usuarios
router.get('/all', authenticateUser, allCurrentUser);


export default router;