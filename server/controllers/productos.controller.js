import prisma from '../../src/lib/prisma';

export const getAllProductos = async (req, res) => {
    try {
      
    const productos = await prisma.producto.findMany();

    if (!productos) {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }

      res.json(productos);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservas activas' });
    }
  };