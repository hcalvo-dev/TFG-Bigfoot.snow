import prisma from '../../src/lib/prisma';

export const getMontanas = async (req, res) => {
    try {
      
    const montanas = await prisma.montaña.findMany();


      res.json(montanas);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las montañas' });
    }
  };