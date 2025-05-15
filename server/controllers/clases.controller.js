import prisma from '../../src/lib/prisma';

export const getClasesActivas = async (req, res) => {
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
        clase: {
          include: {
            instructor: {
              include: {
                usuario: true, // para acceder a instructor.usuario.nombre
              },
            },
          },
        },
        productos: {
          include: { producto: true },
        },
      },
    });

    res.json({ total: reservas.length, datos: reservas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas activas' });
  }
};

export const deleteReserva = async (req, res) => {
  try {
    const { id } = req.body;
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: 'No autenticado' });
    }


    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
      include: {
        clase: {
          include: {
            reservas: true,
          },
        },
      },
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    if (reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Eliminar la disponibilidad reservada
    const deletedDisponibilidad = await prisma.instructorDisponibilidad.deleteMany({
      where: {
        instructorId: reserva.clase?.instructorId,
        horaInicio: reserva.fechaInicio,
        horaFin: reserva.fechaFin,
        disponible: false,
      },
    });

    // Eliminar la reserva
    await prisma.reserva.delete({
      where: { id: reserva.id },
    });

    // Comprobar si la clase tiene más reservas
    const reservasRestantes = await prisma.reserva.count({
      where: { claseId: reserva.claseId },
    });

    // Si no quedan reservas, eliminar la clase
    if (reservasRestantes === 0 && reserva.claseId) {
      await prisma.clase.delete({
        where: { id: reserva.claseId },
      });
    } else {
      console.log('Clase no eliminada porque aún tiene reservas');
    }

    return res.json({ ok: true, message: 'Reserva eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar reserva' });
  }
};
