import { Router } from 'express';
import { getClasesActivas,deleteReserva,clases_agendadas } from '../controllers/clases.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { requireInstructor } from '../middlewares/requireInstructor';

const router = Router();

router.get('/clases-activas', authenticateUser, getClasesActivas);

// Clases que tiene el instructor para impartir
router.get('/clases-agendadas', authenticateUser,requireInstructor, clases_agendadas);

router.delete('/cancelar-reserva',sanitizeInputs, authenticateUser, deleteReserva);

export default router;