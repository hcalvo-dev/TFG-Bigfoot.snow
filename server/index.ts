// Import dependencias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT, ORIGIN } from './config';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { limpiarReservasExpiradas } from '../utils/limpiarReservas';
import { actualizarClimaMontanas } from '../utils/actualizarClimaMontaña';
import path from 'path';

// Importa las rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import estadisticasRoutes from './routes/estadisticas.routes';
import rolesRoutes from './routes/roles.routes';
import montanasRoutes from './routes/montanas.routes';
import instructorRoutes from './routes/instructor.routes';
import clasesRoutes from './routes/clase.routes';
import nivelRoutes from './routes/nivel.routes';
import reservaRoutes from './routes/reserva.routes';
import carritoRoutes from './routes/carrito.routes';
import categoriasRoutes from './routes/categorias.routes';
import tiendasRoutes from './routes/tiendas.routes';
import rutasMontañasRoutes from './routes/rutasMontañas.routes';
import climaRoutes from './routes/clima.routes';
import descuentosRoutes from './routes/descuentos.routes';
import productoRoutes from './routes/producto.routes';

// Importa las variables de entorno desde .env
dotenv.config();

// Inicia la aplicación Express
const app = express();

// Permite la entrada de cookies - para el manejo de CSRF
app.use(cookieParser());

// Permite la comunicación entre el cliente y el servidor
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

// Middleware para parsear el JSON en las peticiones - recibe JSON y lo convierte a un objeto javascript
app.use(express.json());

// Crea el Middleware CSRF que guarda el token en una cookie
const csrfProtection = csrf({ cookie: true });

// Antes de procesar cualquier ruta, se ejecutara el middleware CSRF y comprobara si el token es valido
app.use(csrfProtection);

// Ruta para obtener las imagenes
app.use('/uploads', express.static('public/uploads'));

// Middleware para limpiar reservas expiradas cada minuto
setInterval(() => {
  limpiarReservasExpiradas();
}, 60 * 1000); // cada minuto

// Tarea programada para actualizar el clima de las montañas a las 06:00 AM todos los días
cron.schedule('0 4 * * *', async () => {
  console.log('Actualizando clima de montañas...');
  await actualizarClimaMontanas();
});

// Tarea programada para actualizar el clima de las montañas a las 16:00 PM todos los días
cron.schedule('0 12 * * *', async () => {
  console.log('Actualizando clima de montañas...');
  await actualizarClimaMontanas();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/montanas', montanasRoutes);
app.use('/api/rutas', rutasMontañasRoutes);
app.use('/api/clima', climaRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/nivel', nivelRoutes);
app.use('/api/tiendas', tiendasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/reserva', reservaRoutes);
app.use('/api/descuentos', descuentosRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
