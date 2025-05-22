import { Router } from 'express';
import { getAllCategorias } from '../controllers/categorias.controller';

const router = Router();


// Ruta para obtener todos los usuarios
router.get('/all', getAllCategorias);


export default router;