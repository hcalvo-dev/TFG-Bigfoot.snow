import prisma from '../../src/lib/prisma';

export const getReservasActivas = async (req, res) => {
  try {
    const user = req.user;
    const reservas = await prisma.reserva.findMany({
      where: {
        usuarioId: user.id,
        fechaFin: { gt: new Date() },
        estado: 'confirmada',
        pagado: true,
      },
      include: {
        clase: true,
        productos: { include: { producto: true } }
      }
    });
    
    res.json({ total: reservas.length, datos: reservas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas activas' });
  }
};

export const getClasesProximas = async (req, res) => {
  try {
    const user = req.user;

    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    mañana.setHours(0, 0, 0, 0); // 00:00:00

    const finMañana = new Date(mañana);
    finMañana.setHours(23, 59, 59, 999); // 23:59:59.999

    const clases = await prisma.reserva.findMany({
      where: {
        usuarioId: user.id,
        claseId: { not: null },
        fechaInicio: {
          gte: mañana,
          lte: finMañana,
        },
        pagado: true, 
      },
      include: {
        clase: {
          include: {
            instructor: {
              include: { usuario: true }
            }
          }
        }
      }
    });

    res.json({ total: clases.length, datos: clases });
  } catch (error) {
    console.error('❌ Error al obtener clases próximas:', error);
    res.status(500).json({ error: 'Error al obtener clases próximas' });
  }
};

export const getProductosReservados = async (req, res) => {
  try {
    const user = req.user;
    const productos = await prisma.productoReserva.findMany({
      where: {
        reserva: { usuarioId: user.id }
      },
      include: {
        producto: true,
        reserva: true
      }
    });
    res.json({ total: productos.length, datos: productos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos reservados' });
  }
};
