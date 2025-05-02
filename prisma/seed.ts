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

  const categoria = await prisma.categoria.upsert({
    where: { nombre: 'Esquí' },
    update: {},
    create: {
      nombre: 'Esquí',
    },
  });
  
  const productos = await prisma.producto.createMany({
    data: [
      {
        nombre: 'Botas de esquí',
        descripcion: 'Botas térmicas de alta calidad para nieve profunda.',
        precioDia: 18.5,
        estado: 'disponible',
        imagenUrl: '/img/productos/botas.jpg',
        stockTotal: 10,
        categoriaId: categoria.id,
      },
      {
        nombre: 'Tablas de snowboard',
        descripcion: 'Tablas modernas con diseño antideslizante.',
        precioDia: 25.0,
        estado: 'disponible',
        imagenUrl: '/img/productos/snowboard.jpg',
        stockTotal: 5,
        categoriaId: categoria.id,
      },
      {
        nombre: 'Casco protector',
        descripcion: 'Casco resistente con visera incluida.',
        precioDia: 8.0,
        estado: 'disponible',
        imagenUrl: '/img/productos/casco.jpg',
        stockTotal: 20,
        categoriaId: categoria.id,
      },
      {
        nombre: 'Gafas anti-reflejo',
        descripcion: 'Protección UV para alta montaña.',
        precioDia: 5.0,
        estado: 'disponible',
        imagenUrl: '/img/productos/gafas.jpg',
        stockTotal: 30,
        categoriaId: categoria.id,
      },
    ],
  });

  await prisma.productoDisponibilidad.create({
    data: {
      productoId: 1, // Ajusta el ID si lo haces individualmente
      fecha: new Date('2025-12-20'),
      cantidadDisponible: 5,
    },
  });

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
