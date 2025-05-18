import prisma from '../../src/lib/prisma';

export const ReservaClase = async (req, res) => {
  try {
    const { instructorId, montanaId, especialidad, fecha, horas, nivelId } = req.body;
    const usuarioId = req.user?.id;

    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

    const fechaBase = new Date(fecha);
    const horasReservadas = [];

    const instructor = await prisma.instructor.findUnique({
      where: { id: Number(instructorId) },
      select: { userId: true },
    });
  
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor no encontrado' });
    }

    if (instructor.userId === usuarioId) {
      return res.status(400).json({ error: 'No puedes reservar una clase contigo mismo' });
    }

    for (const horaStr of horas) {
      const [h, m] = horaStr.split(':').map(Number);
      const inicio = new Date(fechaBase);
      inicio.setHours(h, m, 0, 0);

      const fin = new Date(inicio);
      fin.setHours(fin.getHours() + 1);

      // Verificar si ya está ocupada
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

      // Revisar si ya existe con disponible: true y actualizar
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
        } else {
          continue; // ya estaba no disponible
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

      // Buscar clase existente
      const claseExistente = await prisma.clase.findFirst({
        where: {
          titulo: `Clase de ${especialidad}`,
          nivel: nivelId.toString(),
          instructorId: Number(instructorId),
        },
      });

      const nivel = await prisma.nivel.findUnique({
        where: { id: Number(nivelId) },
      });

      if (!nivel) {
        return res.status(404).json({ error: 'Nivel no encontrado' });
      }

      const clase =
        claseExistente ??
        (await prisma.clase.create({
          data: {
            titulo: `Clase de ${especialidad}`,
            descripcion: `Clase personalizada de ${especialidad} nivel ${nivelId}`,
            nivel: nivelId.toString(),
            duracion: 1,
            precio: nivel.precio,
            tipo: 'individual',
            instructorId: Number(instructorId),
            montanaId: Number(montanaId),
          },
        }));

      await prisma.reserva.create({
        data: {
          fechaInicio: inicio,
          fechaFin: fin,
          estado: 'confirmada',
          metodoPago: 'tarjeta',
          total: nivel.precio,
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

    return res.status(200).json({ horasReservadas });
  } catch (error) {
    console.error('❌ Error al reservar clase:', error);
    return res.status(500).json({ error: 'Error al procesar la reserva' });
  }
};
