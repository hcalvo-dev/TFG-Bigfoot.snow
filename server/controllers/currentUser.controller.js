import prisma from '../../src/lib/prisma';
import fs from 'fs';
import path from 'path';

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    const rol = await prisma.rol.findUnique({
      where: { id: user.rolId },
    });

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: rol.nombre,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

export const updateCurrentUser = async (req, res) => {
  try {
    const { id, nombre, email, password, rol } = req.body;
    const rolesPermitidos = ['admin', 'user'];

    const dataToUpdate = {};

    if (nombre) dataToUpdate.nombre = nombre;
    if (email) dataToUpdate.email = email;

    if (password) {
      const bcrypt = await import('bcryptjs');
      const hashed = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashed;
    }

    if (rol) {
      if (!req.user?.id || req.user.id === id) {
        return res.status(403).json({
          message: '❌ Solo otro administrador puede cambiar tu rol',
        });
      }

      if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({
          message: '❌ Rol inválido. Solo se permiten admin o user',
        });
      }

      dataToUpdate.rol = {
        connect: { nombre: rol },
      };
    }

    // Verificamos si hay imagen y si el usuario es instructor
    let nuevaFotoUrl = null;
    const file = req.file;

    if (file) {
      const instructor = await prisma.instructor.findUnique({
        where: { userId: Number(id) },
      });

      if (!instructor) {
        return res.status(400).json({
          message: '❌ El usuario no es un instructor, no se puede subir imagen',
        });
      }

      nuevaFotoUrl = `/uploads/${file.filename}`;

      // Borrar imagen anterior si existe
      if (instructor.fotoUrl) {
        const rutaAnterior = path.join('public', instructor.fotoUrl);
        fs.unlink(rutaAnterior, (err) => {
          if (err) {
            console.warn(`⚠️ No se pudo eliminar la imagen anterior: ${rutaAnterior}`);
          }
        });
      }

      // Actualizar la imagen del instructor
      await prisma.instructor.update({
        where: { userId: Number(id) },
        data: {
          fotoUrl: nuevaFotoUrl,
        },
      });
    }

    if (Object.keys(dataToUpdate).length === 0 && !nuevaFotoUrl) {
      return res.status(400).json({ message: 'No se envió ningún campo para actualizar' });
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.json({
      message: '✅ Usuario actualizado correctamente',
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ Error en updateCurrentUser:', error);
    res.status(500).json({ message: '❌ Error al actualizar el usuario' });
  }
};

export const deleteCurrentUser = async (req, res) => {
  try {
    const { id } = req.body;

    // No permitir que el usuario elimine su propia cuenta
    if (req.user?.id === id) {
      return res.status(403).json({
        message: '❌ No puedes eliminar tu propia cuenta.',
      });
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: id },
      data: { estadoCuenta: false },
    });

    res.json({ message: 'Cuenta desactivada correctamente', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al desactivar la cuenta' });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { id } = req.body;

    const updatedUser = await prisma.usuario.update({
      where: { id: id, estadoCuenta: false },
      data: { estadoCuenta: true },
    });

    res.json({ message: 'Cuenta reactivada correctamente', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al reactivar la cuenta' });
  }
};

export const allCurrentUser = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        rol: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};
