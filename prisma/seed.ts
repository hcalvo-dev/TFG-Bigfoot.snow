import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crear roles si no existen
  const [userRole,instructorRole, adminRole] = await Promise.all([
    prisma.rol.upsert({
      where: { nombre: 'user' },
      update: {},
      create: { nombre: 'user' },
    }),
    prisma.rol.upsert({
      where: { nombre: 'admin' },
      update: {},
      create: { nombre: 'admin' },
    }),
    prisma.rol.upsert({
        where: { nombre: 'instructor' },
        update: {},
        create: { nombre: 'instructor' },
      }),
  ]);

}

main()
  .then(() => {
    console.log('✔ Seed completado');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Error al ejecutar seed:', e);
    return prisma.$disconnect().then(() => process.exit(1));
  });
