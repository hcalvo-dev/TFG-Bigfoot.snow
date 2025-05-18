import prisma from '../../src/lib/prisma';

export const getAllDescuentos = async (req, res) => {
  try {
    
    const descuentos = await prisma.descuento.findMany({
      where: {
        activo: true,
      },
    });

    res.json(descuentos);
  } catch (error) {
    console.error('💥 Error inesperado al obtener descuentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
