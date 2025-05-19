import prisma from '../../src/lib/prisma';

export const getAllNivel = async (req, res) => {
    try {
      
    const niveles = await prisma.nivel.findMany();

    if (!niveles) {
      return res.status(404).json({ message: 'No se encontraron niveles' });
    }

      res.json(niveles);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservas activas' });
    }
  };