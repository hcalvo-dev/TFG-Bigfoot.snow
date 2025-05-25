import prisma from '../src/lib/prisma';

export async function limpiarReservasExpiradas() {

  const reservasExpiradas = await prisma.reserva.findMany({
    where: {
      pagado: false,
      expiresAt: { lte: new Date() },
    },
    include: {
      clase: true,
    },
  });

  if (reservasExpiradas.length === 0) return;

  const idsReservasExpiradas = reservasExpiradas.map((r) => r.id);

  for (const reserva of reservasExpiradas) {

    const instructorId = reserva.clase?.instructorId;

    if (!instructorId) {
      console.warn(
        '  ⚠️ No hay clase/instructor asociado a esta reserva. Intentando recuperar por horario manual...'
      );

      const disponibilidadReal = await prisma.instructorDisponibilidad.findFirst({
        where: {
          instructorId,
        },
      });

      const disponibilidad = await prisma.instructorDisponibilidad.updateMany({
        where: {
          horaInicio: reserva.fechaInicio,
          horaFin: reserva.fechaFin,
          disponible: false,
        },
        data: {
          disponible: true,
        },
      });

    } else {
      const disponibilidad = await prisma.instructorDisponibilidad.updateMany({
        where: {
          instructorId,
          fecha: new Date(reserva.fechaInicio.toDateString()),
          horaInicio: reserva.fechaInicio,
          horaFin: reserva.fechaFin,
          disponible: false,
        },
        data: {
          disponible: true,
        },
      });

    }
  }

  // 🔥 Eliminar primero las entradas de ProductoReserva relacionadas
  await prisma.productoReserva.deleteMany({
    where: {
      reservaId: { in: idsReservasExpiradas },
    },
  });

  // 🧽 Luego eliminar las reservas
  const result = await prisma.reserva.deleteMany({
    where: {
      id: { in: idsReservasExpiradas },
    },
  });

  console.log(`🗑️ Reservas eliminadas: ${result.count}`);
  console.log('✅ Limpieza finalizada.');
}
