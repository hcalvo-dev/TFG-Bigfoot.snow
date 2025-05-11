import prisma from '../../src/lib/prisma';

export const getAllNivel = async (req, res) => {
    try {
      
    const niveles = await prisma.nivel.findMany();

      res.json(niveles);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservas activas' });
    }
  };