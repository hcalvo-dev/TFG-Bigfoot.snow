import prisma from '../../src/lib/prisma';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';

export const reservarClase = async (req, res) => {
  try {
    const { instructorId, montanaId, fecha, horas, nivelId } = req.body;
    const usuarioId = req.user?.id;
    const fechaBase = new Date(fecha);
    const horasReservadas = [];

    let token =
      req.cookies.token_carrito_producto ||
      req.headers['token_carrito_producto'] ||
      req.cookies.token_carrito_clase ||
      req.headers['token_carrito_clase'];

    if (!token) {
      token = jwt.sign({ tipo: 'reservaClase' }, JWT_SECRET, { expiresIn: '10m' });
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

      const yaOcupada = await prisma.instructorDisponibilidad.findFirst({
        where: {
          instructorId: Number(instructorId),
          fecha: fechaBase,
          horaInicio: inicio,
          horaFin: fin,
          disponible: false,
        },
      });

      if (yaOcupada) continue;

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
      }
    }

    if (horasReservadas.length === 0) {
      return res.status(409).json({ message: 'Ninguna de las horas está disponible' });
    }

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

export const reservarProducto = async (req, res) => {
  try {
    const { productoId, fechaInicio, fechaFin, dias, total } = req.body;
    const usuarioId = req.user?.id;

    let token =
      req.cookies.token_carrito_clase ||
      req.headers['token_carrito_clase'] ||
      req.cookies.token_carrito_producto ||
      req.headers['token_carrito_producto'];

    if (!token) {
      token = jwt.sign({ tipo: 'reservaProducto' }, JWT_SECRET, { expiresIn: '10m' });
    }

    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    const fechaIni = new Date(fechaInicio);
    const fechaFinReal = new Date(fechaFin);
    const diasReserva = [];

    for (
      let d = new Date(fechaIni);
      d <= fechaFinReal;
      d.setDate(d.getDate() + 1)
    ) {
      const fechaActual = new Date(d);

      const reservasEnFecha = await prisma.productoReserva.aggregate({
        where: {
          reserva: {
            fechaInicio: { lte: fechaActual },
            fechaFin: { gte: fechaActual },
            pagado: false,
          },
          productoId: productoId,
        },
        _sum: {
          cantidad: true,
        },
      });

      const totalReservado = reservasEnFecha._sum.cantidad || 0;

      if (totalReservado >= producto.stockTotal) {
        return res.status(409).json({
          success: false,
          error: `No hay stock disponible para la fecha ${fechaActual.toISOString().split('T')[0]}`,
        });
      }

      diasReserva.push(new Date(fechaActual));
    }

    const nuevaReserva = await prisma.reserva.create({
      data: {
        fechaInicio: fechaIni,
        fechaFin: fechaFinReal,
        estado: 'pendiente',
        metodoPago: '',
        total,
        pagado: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        tokenCarrito: token,
        ...(usuarioId && { usuarioId }),
        productos: {
          create: {
            productoId,
            cantidad: 1,
          },
        },
        montanaId: 1, // opcional si quieres vincular a una montaña
      },
    });

    return res
      .cookie('token_carrito_producto', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .status(200)
      .json({ success: true, reservaId: nuevaReserva.id });
  } catch (error) {
    console.error('❌ Error al reservar producto:', error);
    return res.status(500).json({ success: false, error: 'Error al procesar la reserva' });
  }
};

