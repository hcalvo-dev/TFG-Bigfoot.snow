import { Router } from 'express';
import { getAllCategorias } from '../controllers/categorias.controller';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = Router();


// Ruta para obtener todos los usuarios
router.get('/all', authenticateUser, getAllCategorias);


export default router;