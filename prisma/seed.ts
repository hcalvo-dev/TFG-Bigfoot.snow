import { seedRoles } from './Seed/rol';
import { seedMontañasYRutas } from './Seed/montaña';
import { seedUsers } from './Seed/users';
import { seedNiveles } from './Seed/nivel';
import { seedDescuentos } from './Seed/descuentos';
import { seedTiendas } from './Seed/tiendas';
import { seedCategorias } from './Seed/categorias';
import { seedProductos } from './Seed/productos';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  
  await seedRoles();
  await seedMontañasYRutas();
  await seedUsers();
  await seedNiveles();
  await seedDescuentos();
  await seedTiendas();
  await seedCategorias();
  await seedProductos();

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
