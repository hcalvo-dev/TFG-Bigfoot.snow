// Import dependencias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT, ORIGIN } from './config';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

// Importa las rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import estadisticasRoutes from './routes/estadisticas.routes';
import rolesRoutes from './routes/roles.routes';
import montanasRoutes from './routes/montanas.routes';
import instructorRoutes from './routes/instructor.routes';
import nivelRoutes from './routes/nivel.routes';
import reservationRoutes from './routes/reserva.routes'; 

// Importa las variables de entorno desde .env
dotenv.config();

// Inicia la aplicación Express
const app = express();

// Permite la entrada de cookies - para el manejo de CSRF 
app.use(cookieParser());

// Permite la comunicación entre el cliente y el servidor
app.use(cors({
    origin: ORIGIN, 
    credentials: true
  }));

// Middleware para parsear el JSON en las peticiones - recibe JSON y lo convierte a un objeto javascript
app.use(express.json());

// Crea el Middleware CSRF que guarda el token en una cookie
const csrfProtection = csrf({ cookie: true });

// Antes de procesar cualquier ruta, se ejecutara el middleware CSRF y comprobara si el token es valido
app.use(csrfProtection);

// Ruta para obtener las imagenes
app.use('/uploads', express.static('public/uploads'));

// Rutas
app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/montanas', montanasRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/nivel', nivelRoutes);
app.use('/api/reservations', reservationRoutes);
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
