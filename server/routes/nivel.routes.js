// routes/instructor.routes.js
import express from 'express';
import {  getAllNivel, editNivel } from '../controllers/nivel.controller.js';
import { sanitizeInputs } from '../middlewares/sanitize.middleware';
import { authenticateUser } from '../middlewares/authenticate.middleware';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = express.Router();

router.get('/all', getAllNivel);

// Ruta para editar el nivel
router.patch('/edit', authenticateUser, requireAdmin, sanitizeInputs, editNivel);

export default router;
