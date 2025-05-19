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

    // Para nombres compuestos: primera letra + palabra completa
    if (palabras.length > 1) {
      return `Bigfoot-${palabras[0][0].toUpperCase()}${palabras[1].charAt(0).toUpperCase()}${palabras[1].slice(1)}`;
    }

    // Si es una sola palabra (como Cerler)
    return `Bigfoot-${palabras[0].charAt(0).toUpperCase()}${palabras[0].slice(1)}`;
  }

  for (const montana of montanas) {
    const nombre = generarNombreTienda(montana);
    await prisma.tienda.upsert({
      where: { nombre },
      update: {},
      create: {
        nombre,
        direccion: `${montana} Centro`,
        telefono: '600123456',
      },
    });
  }

  console.log('✅ Tiendas creadas');
}

seedTiendas()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
