import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import reservationRoutes from './routes/reservation.routes'; 
import { PORT, ORIGIN } from './config';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookieParser());

// Middlewares
app.use(cors({
    origin: ORIGIN, // la URL del cliente (tu frontend Astro)
    credentials: true
  }));

app.use(express.json());

// Middleware CSRF que guarda el token en una cookie
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Rutas
app.use('/api/auth', authRoutes); 
app.use('/api/reservations', reservationRoutes);
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
