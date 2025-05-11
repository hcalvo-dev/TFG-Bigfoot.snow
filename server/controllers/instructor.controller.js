import prisma from '../../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { addDays, addMonths, startOfDay, setHours, setMinutes, isBefore, format, addHours } from 'date-fns';

export const createInstructor = async (req, res) => {
  try {
    console.log('📥 Datos recibidos del body:', req.body);
    const { nombre, email, password, especialidad, nivel, montanaId } = req.body;

    if (!req.file) {
      console.warn('⚠️ No se subió ninguna imagen');
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    console.log('📸 Imagen recibida:', req.file.filename);

    const existingUser = await prisma.usuario.findUnique({ where: { email } });

    if (existingUser) {
      console.warn('⚠️ El email ya está registrado');
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fotoUrl = `/uploads/${req.file.filename}`;

    const user = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        estadoCuenta: true,
        rol: {
          connect: { nombre: 'instructor' },
        },
        instructor: {
          create: {
            especialidad,
            fotoUrl,
            nivelRel: {
              connect: { id: Number(nivel) }, // ✅ Conexión con nivel por ID
            },
            montañas: {
              connect: { id: Number(montanaId) },
            },
          },
        },
      },
      include: {
        instructor: true,
      },
    });

    const instructorId = user.instructor?.id;

    if (!instructorId) {
      console.error('❌ No se pudo obtener el ID del instructor');
      return res.status(500).json({ message: 'No se pudo obtener el ID del instructor' });
    }

    const hoy = startOfDay(new Date());
    const fin = addMonths(hoy, 6);
    const disponibilidades = [];

    for (let i = 0; i <= (fin - hoy) / (1000 * 60 * 60 * 24); i++) {
      const fecha = addDays(hoy, i);
      const horaInicio = setMinutes(setHours(fecha, 9), 0);
      const horaFin = setMinutes(setHours(fecha, 14), 0);

      disponibilidades.push({
        instructorId,
        fecha,
        horaInicio,
        horaFin,
        disponible: true,
      });
    }

    const chunkSize = 30;
    for (let i = 0; i < disponibilidades.length; i += chunkSize) {
      const chunk = disponibilidades.slice(i, i + chunkSize);
      await prisma.instructorDisponibilidad.createMany({
        data: chunk,
        skipDuplicates: false,
      });
    }

    console.log('✅ Instructor y disponibilidades creados correctamente');
    res.status(201).json({ message: '✅ Instructor creado con disponibilidad', user });
  } catch (err) {
    console.error('❌ Error al crear instructor con disponibilidad:', err?.meta ?? err);
    res.status(500).json({ message: '❌ Error al crear el instructor' });
  }
};


export const getInstructoresDisponibles = async (req, res) => {
  try {
    console.log('Body recibido:', req.body);
    const { montanaId, especialidad } = req.body;

    // Validación
    if (!montanaId || !especialidad) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos: montaña o especialidad.' });
    }

    const instructores = await prisma.instructor.findMany({
  where: {
    especialidad,
    montañas: {
      some: {
        id: Number(montanaId),
      },
    },
  },
  include: {
    usuario: {
      select: { nombre: true },
    },
  },
});

    if (instructores.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(instructores);
  } catch (error) {
    console.error('Error al obtener instructores disponibles:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getHorariosInstructor = async (req, res) => {
  try {
    console.log('📥 Datos recibidos en la solicitud:', req.body);
    const { montanaId, especialidad, fechaSeleccionada } = req.body;

    if (!montanaId || !especialidad || !fechaSeleccionada) {
      console.warn('⚠️ Faltan parámetros requeridos.');
      return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
    }

    const hoy = startOfDay(new Date());
    const mañana = addDays(hoy, 1);
    const fechaConsulta = startOfDay(new Date(fechaSeleccionada));

    if (fechaConsulta < mañana) {
      console.warn('⚠️ Fecha inválida: debe ser posterior al día de hoy.');
      return res.status(400).json({ message: 'La fecha debe ser a partir de mañana.' });
    }

    console.log('🔍 Buscando instructores con especialidad:', especialidad, 'y montaña ID:', montanaId);
    const instructores = await prisma.instructor.findMany({
      where: {
        especialidad,
        montañas: {
          some: { id: Number(montanaId) },
        },
      },
    });

    const instructorIds = instructores.map(i => i.id);
    console.log('👨‍🏫 IDs de instructores encontrados:', instructorIds);

    if (instructorIds.length === 0) {
      console.warn('⚠️ No se encontraron instructores disponibles.');
      return res.json([]);
    }

    const fechaInicio = new Date(`${fechaSeleccionada}T00:00:00`);
    const fechaFin = new Date(`${fechaSeleccionada}T23:59:59`);
    console.log('📅 Rango de fecha seleccionado:', fechaInicio, fechaFin);

    console.log('🔎 Consultando disponibilidades...');
    const disponibilidades = await prisma.instructorDisponibilidad.findMany({
      where: {
        instructorId: { in: instructorIds },
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        disponible: true,
      },
    });
    console.log('✅ Disponibilidades encontradas:', disponibilidades.length);

    console.log('🗓️ Consultando clases ya reservadas...');
    const clasesReservadas = await prisma.clase.findMany({
      where: {
        instructorId: { in: instructorIds },
        reservas: {
          some: {
            fechaInicio: {
              gte: fechaInicio,
              lte: fechaFin,
            },
          },
        },
      },
      select: {
        instructorId: true,
        reservas: {
          where: {
            fechaInicio: {
              gte: fechaInicio,
              lte: fechaFin,
            },
          },
          select: {
            fechaInicio: true,
          },
        },
      },
    });

    const horasOcupadas = new Set(
      clasesReservadas.flatMap(clase =>
        clase.reservas.map(r =>
          format(new Date(r.fechaInicio), 'HH:mm')
        )
      )
    );
    console.log('⛔ Horas ya ocupadas:', Array.from(horasOcupadas));

    console.log('🛠️ Generando slots de disponibilidad por hora...');
    const resultado = [];
    for (const disponibilidad of disponibilidades) {
      const start = new Date(disponibilidad.horaInicio);
      const end = new Date(disponibilidad.horaFin);
      console.log(`⏱️ Slot desde ${start} hasta ${end}`);

      let current = new Date(start);
      while (isBefore(current, end)) {
        const horaStr = format(current, 'HH:mm');
        resultado.push({
          hora: horaStr,
          disponible: !horasOcupadas.has(horaStr),
        });
        current = addHours(current, 1); // Clases de 1h
      }
    }

    console.log('📊 Total de slots generados:', resultado.length);

    const horarioUnico = Array.from(
      new Map(resultado.map(item => [item.hora, item])).values()
    );

    const ordenado = horarioUnico.sort((a, b) => a.hora.localeCompare(b.hora));
    console.log('✅ Horario final (sin duplicados):', ordenado);

    res.json(ordenado);
  } catch (error) {
    console.error('❌ Error al obtener horarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};