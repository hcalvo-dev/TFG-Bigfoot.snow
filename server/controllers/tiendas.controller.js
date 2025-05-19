import prisma from '../../src/lib/prisma';

export const getAllTiendas = async (req, res) => {
    try {
      
    const tiendas = await prisma.tienda.findMany();

    if (!tiendas) {
      return res.status(404).json({ message: 'No se encontraron tiendas' });
    }

      res.json(tiendas);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservas activas' });
    }
  };