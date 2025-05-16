// routes/instructor.routes.js
import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { createInstructor, getInstructoresDisponibles, getHorariosInstructor, getAllInstructors } from '../controllers/instructor.controller.js';

const router = express.Router();

router.post('/create', upload.single('foto'), createInstructor);

// Ruta para obtener instructores disponibles en función de la montaña y especialidad
router.post('/disponibles', getInstructoresDisponibles);

// Ruta para obtener los horarios de un instructor 
router.post('/horarios', getHorariosInstructor);

// Ruta para obtener todos los instructores
router.get('/all', getAllInstructors);

export default router;
