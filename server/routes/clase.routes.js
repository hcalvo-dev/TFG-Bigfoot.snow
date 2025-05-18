import { Router } from 'express';
import { getClasesActivas,deleteReserva,clases_agendadas } from '../controllers/clases.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();

router.get('/clases-activas', authenticateUser, getClasesActivas);

// Clases que tiene el instructor para impartir
router.get('/clases-agendadas', authenticateUser, clases_agendadas);

router.delete('/cancelar-reserva', authenticateUser, deleteReserva);

export default router;