import prisma from '../../src/lib/prisma';

export const getAllCategorias = async (req, res) => {
    try {
      
    const categorias = await prisma.categoria.findMany();

    if (!categorias) {
      return res.status(404).json({ message: 'No se encontraron Categorias' });
    }

      res.json(categorias);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservas activas' });
    }
  };