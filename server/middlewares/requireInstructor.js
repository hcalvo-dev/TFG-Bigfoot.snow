// middlewares/requireInstructor.ts
import prisma from '../../src/lib/prisma';

export const requireInstructor = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { rol: true },
    });

    if (!usuario || usuario.rol.nombre !== 'instructor') {
      return res.status(403).json({ message: 'Acceso denegado: solo instructores' });
    }

    next();
  } catch (error) {
    console.error('Error en middleware requireInstructor:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
