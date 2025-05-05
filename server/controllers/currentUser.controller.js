import prisma from '../../src/lib/prisma';
import { logoutUser } from './logoutUser.controller';

export const getCurrentUser = async (req, res) => {
    try {
  
      const user = req.user;
      const rol = await prisma.rol.findUnique({
        where: { id: user.rolId }
      });
  
      res.json({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: rol.nombre
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  };

  export const updateCurrentUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const { nombre, email, password } = req.body;
  
      const dataToUpdate = {};
  
      if (nombre) dataToUpdate.nombre = nombre;
      if (email) dataToUpdate.email = email;
      if (password) {
        // Si usas hashing (bcrypt), hashea la password aquí
        const bcrypt = await import('bcryptjs');
        const hashed = await bcrypt.hash(password, 10);
        dataToUpdate.password = hashed;
      }
  
      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({ message: 'No se envió ningún campo para actualizar' });
      }
  
      const updatedUser = await prisma.usuario.update({
        where: { id: userId },
        data: dataToUpdate,
      });
  
      res.json({ message: '✅ Usuario actualizado correctamente', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '❌ Error al actualizar el usuario' });
    }
  };

  export const deleteCurrentUser = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const updatedUser = await prisma.usuario.update({
        where: { id: userId },
        data: { estadoCuenta: false }, 
      });

      console.log('Usuario actualizado:', updatedUser);

      await logoutUser(req, res); 
  
      res.json({ message: 'Cuenta desactivada correctamente', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al desactivar la cuenta' });
    }
  };