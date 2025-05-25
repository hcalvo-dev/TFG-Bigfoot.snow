import prisma from '../../src/lib/prisma';
import bcrypt from 'bcryptjs';
import {
  addDays,
  addMonths,
  startOfDay,
  setHours,
  setMinutes,
  isBefore,
  format,
  addHours,
} from 'date-fns';

export const createInstructor = async (req, res) => {
  try {
    const { nombre, email, password, especialidad, nivel, montanaId, testimonio } = req.body;

    if (!req.file) {
      console.warn('⚠️ No se subió ninguna imagen');
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }


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
            testimonio,
            nivelRel: {
              connect: { id: Number(nivel) },
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

    res.status(201).json({ message: '✅ Instructor creado', user });
  } catch (err) {
    console.error('❌ Error al crear instructor:', err?.meta ?? err);
    res.status(500).json({ message: '❌ Error al crear el instructor' });
  }
};

export const getInstructoresDisponibles = async (req, res) => {
  try {
    const { montanaId, especialidad } = req.body;

    // Validación
    if (!montanaId || !especialidad) {
      return res
        .status(400)
        .json({ message: 'Faltan parámetros requeridos: montaña o especialidad.' });
    }

    const instructores = await prisma.instructor.findMany({
      where: {
        especialidad,
        montañas: {
          some: {
            id: Number(montanaId),
          },
        },
        usuario: {
          rol: {
            nombre: 'instructor', 
          },
        },
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            rol: {
              select: {
                nombre: true,
              },
            },
          },
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

import { startOfDay, setHours, setMinutes, format } from 'date-fns';
import prisma from '../../src/lib/prisma';

import { startOfDay, setHours, setMinutes, format } from 'date-fns';
import prisma from '../../src/lib/prisma';

export const getHorariosInstructor = async (req, res) => {
  try {
    const { montanaId, especialidad, fechaSeleccionada, instructorId } = req.body;


    if (!montanaId || !especialidad || !fechaSeleccionada) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
    }

    const fechaConsulta = startOfDay(new Date(fechaSeleccionada));

    const instructores = await prisma.instructor.findMany({
      where: {
        especialidad,
        montañas: {
          some: { id: Number(montanaId) },
        },
      },
    });

    const instructoresIds = instructores.map((i) => i.id);
    if (instructoresIds.length === 0) {
      return res.json([]);
    }

    const idInstructor = instructorId || instructoresIds[0];

    // 🛠️ Cambio aquí: usar rango de fecha
    const disponibilidad = await prisma.instructorDisponibilidad.findMany({
      where: {
        instructorId: idInstructor,
        fecha: {
          gte: new Date(`${fechaSeleccionada}T00:00:00`),
          lt: new Date(`${fechaSeleccionada}T23:59:59`),
        },
        disponible: false,
      },
      select: {
        horaInicio: true,
      },
    });

    const horasOcupadas = new Set(
      disponibilidad.map((d) => format(new Date(d.horaInicio), 'HH:mm'))
    );


    const slots = [];
    for (let h = 9; h < 14; h++) {
      const hora = format(setMinutes(setHours(fechaConsulta, h), 0), 'HH:mm');
      const disponible = !horasOcupadas.has(hora);
      slots.push({ hora, disponible });
    }

    res.json(slots);
  } catch (error) {
    console.error('❌ Error al obtener horarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



export const getAllInstructors = async (req, res) => {
  try {
    const instructores = await prisma.instructor.findMany({
      where: {
        usuario: {
          rol: {
            nombre: 'instructor',
          },
        },
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true,
          },
        },
        nivelRel: true,
        montañas: true,
      },
    });

    res.status(200).json(instructores);
  } catch (error) {
    console.error('❌ Error al obtener instructores:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};