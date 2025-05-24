import { Router } from 'express';
import { getAllTiendas } from '../controllers/tiendas.controller';

const router = Router();


// Ruta para obtener todos las tiendas
router.get('/all', getAllTiendas);


export default router;