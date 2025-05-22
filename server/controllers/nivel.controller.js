import prisma from '../../src/lib/prisma';

export const getAllNivel = async (req, res) => {
  try {
    const niveles = await prisma.nivel.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });

    if (!niveles) {
      return res.status(404).json({ message: 'No se encontraron niveles' });
    }

    res.json(niveles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas activas' });
  }
};

export const editNivel = async (req, res) => {
  try {
    const { id, precio } = req.body;

    const updatedNivel = await prisma.nivel.update({
      where: { id },
      data: { precio: precio },
    });

    res.json(updatedNivel);

  } catch (error) {
    console.error('Error al actualizar el nivel:', error);
    res.status(500).json({ error: 'Error al actualizar el nivel' });
  }
};
