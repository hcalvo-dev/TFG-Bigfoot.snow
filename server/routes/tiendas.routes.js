import { Router } from 'express';
import { getAllTiendas } from '../controllers/tiendas.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();


// Ruta para obtener todos los usuarios
router.get('/all', authenticateUser, getAllTiendas);


export default router;