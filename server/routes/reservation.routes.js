// reservation.routes.ts (ejemplo básico)
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Rutas de reservas funcionando.' });
});

export default router;
