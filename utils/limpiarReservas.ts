import prisma from '../src/lib/prisma';

export async function limpiarReservasExpiradas() {
  console.log('🧼 Iniciando limpieza de reservas expiradas...');
  console.log('⏰ Fecha y hora actual:', new Date().toISOString());

  const reservasExpiradas = await prisma.reserva.findMany({
    where: {
      pagado: false,
      expiresAt: { lte: new Date() },
    },
    include: {
      clase: true,
    },
  });

  console.log(`🔍 Reservas expiradas encontradas: ${reservasExpiradas.length}`);

  if (reservasExpiradas.length === 0) return;

  for (const reserva of reservasExpiradas) {
    console.log(`🧾 Procesando reserva ID ${reserva.id}:`);
    console.log(`  • Fecha inicio: ${reserva.fechaInicio.toISOString()}`);
    console.log(`  • Fecha fin: ${reserva.fechaFin.toISOString()}`);

    const instructorId = reserva.clase?.instructorId || null;

    if (!instructorId) {
      console.warn('  ⚠️ No hay clase/instructor asociado a esta reserva. Intentando recuperar por horario manual...');

      // intentar encontrar disponibilidad directamente por el horario
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

      console.log(`  🔄 Disponibilidad modificada: ${disponibilidad.count}`);
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

      console.log(`  🔄 Disponibilidad modificada: ${disponibilidad.count}`);
    }
  }

  const result = await prisma.reserva.deleteMany({
    where: {
      pagado: false,
      expiresAt: { lte: new Date() },
    },
  });

  console.log(`🗑️ Reservas eliminadas: ${result.count}`);
  console.log('✅ Limpieza finalizada.');
}
