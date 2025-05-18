import prisma from '../../src/lib/prisma';

export const getClimaByMontana = async (req, res) => {
  console.log('📥 Petición recibida en /api/clima/all');

  try {
    // Verificamos método
    if (req.method !== 'POST') {
      console.warn('⚠️ Método no permitido:', req.method);
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const { nombre } = req.body;
    console.log('🔎 Nombre recibido:', nombre);

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

    console.log('✅ Montaña encontrada:', montana.id, montana.nombre);

    // Buscar clima asociado
    const clima = await prisma.clima.findMany({
      where: {
        montañaId: montana.id,
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    console.log('🌦️ Registros de clima encontrados:', clima.length);

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
