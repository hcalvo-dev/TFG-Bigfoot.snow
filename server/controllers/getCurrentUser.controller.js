import prisma from '../../src/lib/prisma';

export const getCurrentUser = async (req, res) => {
    try {
      console.log('🙋 Usuario desde middleware:', req.user); // <-- Aquí
  
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
      console.error('❌ Error al obtener el usuario:', error); // <-- Aquí
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  };