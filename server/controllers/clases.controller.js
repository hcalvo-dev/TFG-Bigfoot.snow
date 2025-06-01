import prisma from '../../src/lib/prisma';

export const getClasesActivas = async (req, res) => {
  try {
    const user = req.user;

    const reservas = await prisma.reserva.findMany({
      where: {
        usuarioId: user.id,
        claseId: { not: null }, // ✅ Solo reservas con clase asociada
        fechaFin: { gt: new Date() },
        estado: 'confirmada',
        pagado: true,
      },
      include: {
        clase: {
          include: {
            instructor: {
              include: {
                usuario: true,
              },
            },
            montaña: true, // ✅ incluir la montaña
          },
        },
      },
    });

    res.json({ total: reservas.length, datos: reservas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas activas de clases' });
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

    const ahora = new Date();
    const diferenciaHoras =
      (new Date(reserva.fechaInicio).getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diferenciaHoras < 24) {
      return res.status(400).json({ error: 'Quedan menos de 24 horas para la clase' });
    }

    // Eliminar la disponibilidad reservada
    await prisma.instructorDisponibilidad.deleteMany({
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

    if (reservasRestantes === 0 && reserva.claseId) {
      await prisma.clase.delete({
        where: { id: reserva.claseId },
      });
    }

    return res.json({ ok: true, message: 'Reserva eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar reserva' });
  }
};

export const clases_agendadas = async (req, res) => {
  try {
    const usuarioId = req.user?.id;

    const instructor = await prisma.instructor.findUnique({
      where: { userId: usuarioId },
    });

    if (!instructor) {
      return res.status(403).json({ error: 'Este usuario no es un instructor' });
    }

    const reservas = await prisma.reserva.findMany({
      where: {
        clase: {
          instructorId: instructor.id,
        },
        fechaFin: {
          gt: new Date(),
        },
        estado: 'confirmada',
        pagado: true,
      },
      include: {
        clase: {
          include: {
            montaña: {
              select: { nombre: true },
            },
          },
        },
        usuario: true,
      },
      orderBy: {
        fechaInicio: 'asc',
      },
    });

   return res.json({ total: reservas.length, datos: reservas });
  } catch (error) {
    console.error('❌ Error al obtener clases agendadas:', error);
    return res.status(500).json({ error: 'Error al obtener clases agendadas' });
  }
};
