import { seedRoles } from './Seed/rol';
import { seedMontañasYRutas } from './Seed/montaña';
import { seedProductos } from './Seed/productos';
import { seedUsers } from './Seed/users';
import { seedNiveles } from './Seed/nivel';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  
  await seedRoles();
  await seedMontañasYRutas();
  await seedProductos();
  await seedUsers();
  await seedNiveles();

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
