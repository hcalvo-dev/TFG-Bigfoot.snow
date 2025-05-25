import prisma from '../../src/lib/prisma';

export const getRoles = async (req, res) => {
    try {
      
    const roles = await prisma.rol.findMany();

      res.json(roles);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservas activas' });
    }
  };