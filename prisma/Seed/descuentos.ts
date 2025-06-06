import { PrismaClient, AplicaEn } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDescuentos() {
  const hoy = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(hoy.getDate() + 10);

  const descuentos = [
    {
      codigo: 'BIGFOOT10',
      descripcion: '10% de descuento en alquiler de material',
      porcentaje: 10,
      aplicaEn: AplicaEn.PRODUCTOS,
      fechaValidez: fechaLimite,
      activo: true,
    },
    {
      codigo: 'CLASE20',
      descripcion: '20% de descuento en cualquier clase de esquí o snowboard',
      porcentaje: 20,
      aplicaEn: AplicaEn.CLASES,
      fechaValidez: fechaLimite,
      activo: true,
    },
    {
      codigo: 'WELCOME5',
      descripcion: '5% de descuento en compras superiores a 100€',
      porcentaje: 5,
      aplicaEn: AplicaEn.AMBOS,
      fechaValidez: fechaLimite,
      activo: true,
    },
    {
      codigo: 'SNOWFREAK15',
      descripcion: '15% de descuento si reservas más de 2 productos',
      porcentaje: 15,
      aplicaEn: AplicaEn.AMBOS,
      fechaValidez: fechaLimite,
      activo: true,
    }
  ];

  for (const d of descuentos) {
    await prisma.descuento.upsert({
      where: { codigo: d.codigo },
      update: {},
      create: d,
    });
  }

  console.log('✅ Descuentos promocionales insertados');
}
