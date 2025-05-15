import prisma from '../../src/lib/prisma';

export const ReservaClase = async (req, res) => {
  try {
    const { instructorId, montanaId, especialidad, fecha, horas, nivelId } = req.body;
    const usuarioId = req.user?.id;

    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

    const fechaBase = new Date(fecha);
    const horasReservadas = [];

    for (const horaStr of horas) {
      const [h, m] = horaStr.split(':').map(Number);
      const inicio = new Date(fechaBase);
      inicio.setHours(h, m, 0, 0);

      const fin = new Date(inicio);
      fin.setHours(fin.getHours() + 1);

      // Verificamos si ya existe una reserva para esta hora
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

      // Marcar como ocupada
      await prisma.instructorDisponibilidad.create({
        data: {
          instructorId: Number(instructorId),
          fecha: fechaBase,
          horaInicio: inicio,
          horaFin: fin,
          disponible: false,
        },
      });

      // Verificamos si ya hay una clase exactamente igual 
      const claseExistente = await prisma.clase.findFirst({
        where: {
          titulo: `Clase de ${especialidad}`,
          nivel: nivelId.toString(),
          instructorId: Number(instructorId),
        },
      });

      const clase = claseExistente ?? await prisma.clase.create({
        data: {
          titulo: `Clase de ${especialidad}`,
          descripcion: `Clase personalizada de ${especialidad} nivel ${nivelId}`,
          nivel: nivelId.toString(),
          duracion: 1,
          precio: 25,
          tipo: 'individual',
          instructorId: Number(instructorId),
          montanaId: Number(montanaId), 
        },
      });

      await prisma.reserva.create({
        data: {
          fechaInicio: inicio,
          fechaFin: fin,
          estado: 'confirmada',
          metodoPago: 'tarjeta',
          total: clase.precio,
          pagado: true,
          usuarioId,
          claseId: clase.id,
          montanaId: Number(montanaId), 
        },
      });

      horasReservadas.push(horaStr);
    }

    if (horasReservadas.length === 0) {
      return res.status(409).json({ message: 'Ninguna de las horas está disponible' });
    }

    return res.status(200).json({
      horasReservadas,
    });
  } catch (error) {
    console.error('❌ Error al reservar clase:', error);
    return res.status(500).json({ error: 'Error al procesar la reserva' });
  }
};