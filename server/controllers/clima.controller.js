import prisma from '../../src/lib/prisma';

export const getClimaByMontana = async (req, res) => {

  try {
    // Verificamos método
    if (req.method !== 'POST') {
      console.warn('⚠️ Método no permitido:', req.method);
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const { nombre } = req.body;

    if (!nombre) {
      console.warn('❌ Falta el parámetro "nombre"');
      return res.status(400).json({ error: 'Falta el parámetro "nombre"' });
    }

    // Buscar montaña
    const montana = await prisma.montaña.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
    });

    if (!montana) {
      console.warn(`❌ Montaña no encontrada para: ${nombre}`);
      return res.status(404).json({ error: 'Montaña no encontrada' });
    }

    // Buscar clima asociado
    const clima = await prisma.clima.findMany({
      where: {
        montañaId: montana.id,
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    if (!clima || clima.length === 0) {
      console.warn('⚠️ No hay registros de clima para esta montaña');
      return res.status(404).json({ error: 'Clima no encontrado' });
    }

    res.json(clima);
  } catch (error) {
    console.error('💥 Error inesperado al obtener clima:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
