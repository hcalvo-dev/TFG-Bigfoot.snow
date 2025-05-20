// Archivo: prisma/Seed/productos.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function generarDescripcion(nombre: string, categoria: string): string {
  const base: Record<string, string[]> = {
    Cascos: [
      'Diseño aerodinámico que se adapta a cualquier estilo.',
      'Máxima protección sin renunciar a la comodidad.',
      'Tu aliado esencial para descensos seguros y con estilo.',
    ],
    Chaquetas: [
      'Chaqueta técnica para los días más fríos en la montaña.',
      'Conquista la nieve con abrigo, confort y diseño moderno.',
      'Preparada para las condiciones más exigentes, con estilo urbano.',
    ],
    Pantalones: [
      'Pantalones impermeables y transpirables para máxima movilidad.',
      'Comodidad, resistencia y ajuste perfecto en cada pista.',
      'Diseñados para rendir en los descensos más extremos.',
    ],
    Botas: [
      'Firmeza y comodidad para largas jornadas en la nieve.',
      'Botas ergonómicas con sujeción profesional.',
      'Ideales para mantener el calor y controlar cada movimiento.',
    ],
    Snowboard: [
      'Tabla de snowboard con flex intermedio ideal para freestyle.',
      'Potencia tu estilo en la nieve con esta tabla versátil.',
      'Perfecta para riders que buscan equilibrio y velocidad.',
    ],
    Esquí: [
      'Esquís para riders que exigen precisión y fluidez.',
      'Domina cada pista con esta tabla ágil y resistente.',
      'Versátiles, rápidos y estables para todo tipo de nieve.',
    ],
  };

  const opciones = base[categoria];
  if (!opciones) {
    return `${nombre}: Producto de alta calidad para la nieve.`;
  }

  const random = Math.floor(Math.random() * opciones.length);
  return `${nombre}: ${opciones[random]}`;
}

const nombresChulos = {
  Cascos: ['Vortex', 'Helix', 'Stormrider', 'Skullcap', 'AeroX', 'ShadowDome', 'IronPeak', 'FrostGuard', 'Cranius'],
  Chaquetas: ['Blizzard', 'Avalancha', 'Frostline', 'Thermowave', 'Glacier', 'IceBurst', 'SnowRush', 'ColdShell', 'ArcticWind'],
  Pantalones: ['EdgeFlex', 'SnowRush', 'SlopeRider', 'Freecarve', 'DriftGear', 'IceStride', 'SlopePro', 'GlideZone', 'StormLegs'],
  Botas: ['IceGrip', 'TrackPro', 'SnugBoot', 'TrailLock', 'Nordika', 'FrostFoot', 'StepGlide', 'SnowCore', 'AlpineWalk'],
  Snowboard: ['DarkShred', 'FrostByte', 'ShadowCarve', 'SkySplit', 'VoltStorm', 'PowderEdge', 'GravityRide', 'IceSurfer', 'SnowCharger'],
  Esquí: ['SpeedLine', 'BlizzardX', 'AlpineEdge', 'GlideMax', 'IcePulse', 'SlopeCut', 'StormTrack', 'FrozenBlade', 'SnowTrail']
};

export async function seedProductos() {
  const categorias = await prisma.categoria.findMany();
  const tiendas = await prisma.tienda.findMany();

  const productosBase = [
    {
      nombre: 'Cascos',
      categorias: ['Cascos'],
      imagenBase: 'cascos',
      tallas: null,
      medidas: null,
    },
    {
      nombre: 'Chaquetas',
      categorias: ['Chaquetas'],
      imagenBase: 'chaquetas',
      tallas: ['S', 'M', 'L'],
      medidas: null,
    },
    {
      nombre: 'Pantalones',
      categorias: ['Pantalones'],
      imagenBase: 'pantalones',
      tallas: ['S', 'M', 'L'],
      medidas: null,
    },
    {
      nombre: 'Botas',
      categorias: ['Botas'],
      imagenBase: 'botas',
      tallas: ['S', 'M', 'L'],
      medidas: null,
    },
    {
      nombre: 'Snowboard',
      categorias: ['Snowboard'],
      imagenBase: 'snowboard',
      tallas: null,
      medidas: Array.from({ length: 9 }, (_, i) => ({ largo: 151 + i, ancho: 31 + i })),
    },
    {
      nombre: 'Esquí',
      categorias: ['Esquí'],
      imagenBase: 'esquí',
      tallas: null,
      medidas: Array.from({ length: 9 }, (_, i) => ({ largo: 151 + i, ancho: 31 + i })),
    },
  ];

  const preciosMap = new Map<string, number>();
  const descripcionesMap = new Map<string, string>();
  const productosPorNombre = new Map<string, number>();

  for (const base of productosBase) {
    const nombresEstilo = nombresChulos[base.nombre as keyof typeof nombresChulos];

    for (let i = 0; i < nombresEstilo.length; i++) {
      const nombreBase = `${base.nombre} ${nombresEstilo[i]}`;
      const categoriaPrincipal = base.categorias[0];

      if (!preciosMap.has(nombreBase)) {
        preciosMap.set(nombreBase, +(Math.random() * 50 + 10).toFixed(2));
      }

      if (!descripcionesMap.has(nombreBase)) {
        descripcionesMap.set(nombreBase, generarDescripcion(nombreBase, categoriaPrincipal));
      }

      const precio = preciosMap.get(nombreBase)!;
      const descripcion = descripcionesMap.get(nombreBase)!;

      for (const tienda of tiendas) {
        const currentCount = productosPorNombre.get(nombreBase) || 0;
        if (currentCount >= 9) break;

        await prisma.producto.create({
          data: {
            nombre: nombreBase,
            descripcion,
            precioDia: precio,
            estado: 'activo',
            imagenUrl: `/uploads/productos/${base.imagenBase}-${i + 1}.webp`,
            stockTotal: Math.floor(Math.random() * 10 + 1),
            ubicacion: `almacen-${tienda.id}`,
            tallas: base.tallas ?? undefined,
            medidas: base.medidas ? [`${base.medidas[i].largo}:${base.medidas[i].ancho}`] : undefined,
            categorias: {
              connect: base.categorias
                .map((nombre) => {
                  const cat = categorias.find((c) => c.nombre === nombre);
                  return cat ? { id: cat.id } : null;
                })
                .filter(Boolean) as { id: number }[],
            },
            tienda: {
              connect: { id: tienda.id },
            },
          },
        });

        productosPorNombre.set(nombreBase, currentCount + 1);
      }
    }
  }

  console.log('✅ Productos insertados correctamente.');
}

seedProductos()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
