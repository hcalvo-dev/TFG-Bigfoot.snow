import { Router } from 'express';
import { getClasesActivas,deleteReserva } from '../controllers/clases.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();

router.get('/clases-activas', authenticateUser, getClasesActivas);

router.delete('/cancelar-reserva', authenticateUser, deleteReserva);

export default router;