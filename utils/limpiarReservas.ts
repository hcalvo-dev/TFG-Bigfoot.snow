import prisma from '../src/lib/prisma';

export async function limpiarReservasExpiradas() {
  const result = await prisma.reserva.deleteMany({
    where: {
      pagado: false,
      expiresAt: { lte: new Date() },
    },
  });

  if (result.count > 0) {
    console.log(`🗑️ ${result.count} reservas caducadas eliminadas`);
  }
}
