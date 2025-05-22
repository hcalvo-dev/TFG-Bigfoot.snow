// routes/instructor.routes.js
import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { createInstructor, getInstructoresDisponibles, getHorariosInstructor, getAllInstructors } from '../controllers/instructor.controller.js';
import { requireAdmin } from '../middlewares/requireAdmin';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { authenticateUser } from '../middlewares/authenticate.middleware';

const router = express.Router();

router.post('/create', sanitizeInputs, authenticateUser, requireAdmin, upload.single('foto'), createInstructor);

// Ruta para obtener instructores disponibles en función de la montaña y especialidad
router.post('/disponibles',sanitizeInputs, getInstructoresDisponibles);

// Ruta para obtener los horarios de un instructor 
router.post('/horarios', sanitizeInputs, getHorariosInstructor);

// Ruta para obtener todos los instructores
router.get('/all', sanitizeInputs, getAllInstructors);

export default router;
