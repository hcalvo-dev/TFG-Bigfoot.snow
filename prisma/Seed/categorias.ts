import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedCategorias() {
  const categorias = [
    'Cascos',
    'Chaquetas',
    'Pantalones',
    'Botas',
    'Snowboard',
    'Esquí',
    'Forfait',
  ];

  for (const nombre of categorias) {
    await prisma.categoria.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  console.log('✅ Categorías creadas');
}

seedCategorias()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
