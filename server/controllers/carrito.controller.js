import prisma from '../../src/lib/prisma';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';

export const reservarClase = async (req, res) => {
  try {
    const { instructorId, montanaId, fecha, horas, nivelId } = req.body;
    console.log('📩 Body recibido:', req.body);

    const usuarioId = req.user?.id;
    console.log('👤 Usuario autenticado:', usuarioId || 'Anónimo');

    const fechaBase = new Date(fecha);
    console.log('📅 Fecha base de reserva:', fechaBase.toISOString());

    const horasReservadas = [];

    let token = req.cookies.token_carrito_clase || req.headers['token_carrito_clase'];
    console.log('📦 Token recibido del header:', token);

    if (!token) {
      token = jwt.sign({ tipo: 'reservaClase' }, JWT_SECRET, { expiresIn: '10m' });
      console.log('🔐 Token generado:', token);
    }

    const nivel = await prisma.nivel.findUnique({
      where: { id: Number(nivelId) },
    });

    if (!nivel) {
      return res.status(404).json({ error: 'Nivel no encontrado' });
    }

    const precioNivel = nivel.precio;

    for (const horaStr of horas) {
      const [h, m] = horaStr.split(':').map(Number);
      const inicio = new Date(fechaBase);
      inicio.setHours(h, m, 0, 0);

      const fin = new Date(inicio);
      fin.setHours(fin.getHours() + 1);

      console.log(
        `⏰ Procesando hora: ${horaStr} → ${inicio.toISOString()} - ${fin.toISOString()}`
      );

      const yaOcupada = await prisma.instructorDisponibilidad.findFirst({
        where: {
          instructorId: Number(instructorId),
          fecha: fechaBase,
          horaInicio: inicio,
          horaFin: fin,
          disponible: false,
        },
      });

      if (yaOcupada) {
        console.log(`❌ Hora ${horaStr} ya está ocupada. Saltando...`);
        continue;
      }

      const reserva = await prisma.reserva.create({
        data: {
          fechaInicio: inicio,
          fechaFin: fin,
          estado: 'pendiente',
          metodoPago: '',
          total: precioNivel,
          pagado: false,
          ...(usuarioId && { usuarioId }),
          tokenCarrito: token,
          claseId: null,
          montanaId: Number(montanaId),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      console.log('✅ Reserva creada:', reserva.id);
      horasReservadas.push(horaStr);

      const disponibilidad = await prisma.instructorDisponibilidad.findFirst({
        where: {
          instructorId: Number(instructorId),
          fecha: fechaBase,
          horaInicio: inicio,
          horaFin: fin,
        },
      });

      if (disponibilidad) {
        if (disponibilidad.disponible) {
          await prisma.instructorDisponibilidad.update({
            where: { id: disponibilidad.id },
            data: { disponible: false },
          });
          console.log(`🔄 Disponibilidad actualizada a false para ${horaStr}`);
        } else {
          console.log(`⚠️ Ya estaba marcada como no disponible: ${horaStr}`);
        }
      } else {
        await prisma.instructorDisponibilidad.create({
          data: {
            instructorId: Number(instructorId),
            fecha: fechaBase,
            horaInicio: inicio,
            horaFin: fin,
            disponible: false,
          },
        });
        console.log(`🆕 Nueva disponibilidad creada como no disponible para ${horaStr}`);
      }
    }

    if (horasReservadas.length === 0) {
      console.log('⚠️ No se pudo reservar ninguna hora.');
      return res.status(409).json({ message: 'Ninguna de las horas está disponible' });
    }

    console.log('🎉 Horas reservadas correctamente:', horasReservadas);

    return res
      .cookie('token_carrito_clase', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .status(200)
      .json({ horasReservadas });
  } catch (error) {
    console.error('❌ Error al reservar clase:', error);
    return res.status(500).json({ error: 'Error al procesar la reserva' });
  }
};
