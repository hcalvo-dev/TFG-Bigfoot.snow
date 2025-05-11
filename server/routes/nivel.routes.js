// routes/instructor.routes.js
import express from 'express';
import {  getAllNivel } from '../controllers/nivel.controller.js';

const router = express.Router();

router.get('/all', getAllNivel);

export default router;
