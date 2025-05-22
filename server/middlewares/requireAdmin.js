// middlewares/requireAdmin.ts
import prisma from '../../src/lib/prisma';

export const requireAdmin = async (req, res, next) => {
  const userId = req.user?.id;

  console.log('User ID en requireAdmin:', userId); // Agregar log para depuración

  if (!userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { rol: true },
    });

    if (!usuario || usuario.rol.nombre !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
    }

    next();
  } catch (error) {
    console.error('Error en middleware requireAdmin:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
