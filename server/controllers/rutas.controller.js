import prisma from '../../src/lib/prisma';

export const getRutasByNombre = async (req, res) => {
  try {

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Falta el parámetro "nombre"' });
    }

    const montana = await prisma.montaña.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
      include: {
        rutas: true,
      },
    });

    if (!montana) {
      return res.status(404).json({ error: 'Montaña no encontrada' });
    }

    res.json(montana.rutas);
  } catch (error) {
    console.error('💥 Error al obtener rutas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
