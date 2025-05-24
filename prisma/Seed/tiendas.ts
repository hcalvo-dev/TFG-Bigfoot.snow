import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedTiendas() {
  const montanas = [
    "Baqueira Beret",
    "Formigal",
    "Cerler",
    "Boí Taüll",
    "Navacerrada",
    "Valdesquí",
    "San Isidro",
    "Leitariegos",
    "Sierra Nevada"
  ];

  function generarNombreTienda(nombre: string): string {
    const nombreSinAcentos = nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const palabras = nombreSinAcentos.split(' ');

    if (palabras.length > 1) {
      return `Bigfoot-${palabras[0][0].toUpperCase()}${palabras[1].charAt(0).toUpperCase()}${palabras[1].slice(1)}`;
    }

    return `Bigfoot-${palabras[0].charAt(0).toUpperCase()}${palabras[0].slice(1)}`;
  }

  for (const nombreMontana of montanas) {
    const nombreTienda = generarNombreTienda(nombreMontana);

    const montana = await prisma.montaña.findFirst({
      where: {
        nombre: {
          equals: nombreMontana,
          mode: 'insensitive'
        }
      }
    });

    // Así aseguramos de que la montaña existe antes de crear la tienda
    if (!montana) {
      continue;
    }

    await prisma.tienda.upsert({
      where: { nombre: nombreTienda },
      update: {},
      create: {
        nombre: nombreTienda,
        direccion: `${nombreMontana} Centro`,
        telefono: '600123456',
        montanaId: montana.id
      },
    });
  }

  console.log('✅ Tiendas creadas y vinculadas con montañas');
}

seedTiendas()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
