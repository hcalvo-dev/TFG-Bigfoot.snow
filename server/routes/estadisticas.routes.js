import { Router } from 'express';
import { getReservasActivas, getClasesProximas, getProductosReservados } from '../controllers/estadisticasUser.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();

router.get('/reservas-activas', authenticateUser, getReservasActivas);
router.get('/clases-proximas',authenticateUser, getClasesProximas);
router.get('/productos-reservados',authenticateUser, getProductosReservados);

export default router;