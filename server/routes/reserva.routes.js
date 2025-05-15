import { Router } from 'express';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { ReservaClase } from '../controllers/reserva.controller';

const router = Router();

router.post('/clase', sanitizeInputs, authenticateUser, ReservaClase);


export default router;