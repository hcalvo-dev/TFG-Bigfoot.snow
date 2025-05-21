// Archivo: prisma/Seed/productos.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function generarDescripcion(nombre: string, categoria: string, index: number): string {
  const base: Record<string, string[]> = {
   Cascos: [
      'Este casco combina protección avanzada con ventilación optimizada, ideal para largas jornadas en la nieve manteniendo seguridad y confort durante todo el día.',
      'Diseñado para esquiadores exigentes, este casco ofrece un ajuste ergonómico que distribuye uniformemente la presión, reduciendo la fatiga.',
      'Incluye forro desmontable, compatible con sistemas de audio, y materiales resistentes a impactos para un rendimiento superior.',
      'Perfecto para condiciones extremas, con visera integrada que mejora la visibilidad y sistema de cierre rápido.',
      'Ligero pero robusto, este casco incorpora tecnología que absorbe impactos sin comprometer la movilidad del usuario.',
      'Construido con materiales de alta gama, ofrece una experiencia cómoda y segura en descensos rápidos.',
      'Ideal tanto para freestyle como para pistas convencionales, brinda equilibrio entre estilo y seguridad.',
      'Acabados de alta calidad y diseño moderno con múltiples canales de ventilación para mantener la cabeza fresca.',
      'Sistema de ajuste micrométrico y certificación de seguridad que garantiza fiabilidad en cualquier situación.',
    ],
    Chaquetas: [
      'Una chaqueta pensada para quienes enfrentan los climas más fríos, con aislamiento térmico de última generación que mantiene el calor corporal.',
      'Fabricada con materiales impermeables y transpirables, asegura protección contra viento, lluvia y nieve durante horas.',
      'Diseño funcional con múltiples bolsillos, capucha ajustable y detalles reflectantes para condiciones de baja visibilidad.',
      'Ofrece libertad de movimiento gracias a su corte ergonómico y a las costuras flexibles que se adaptan al cuerpo.',
      'Interior con forro polar y tejido técnico que optimiza el confort sin sacrificar rendimiento de la chaqueta.',
      'Apta para actividades intensas, su tecnología de evacuación de humedad mantiene la piel seca y ventilada.',
      'Combinación perfecta de estilo urbano y funcionalidad alpina, con cierres resistentes y ajuste entallado.',
      'Diseñada para riders que no se detienen por el clima, incorpora zonas reforzadas en hombros y codos.',
      'Disponible en múltiples tallas y colores, es una opción versátil tanto para esquí como para snowboard.',
    ],
    Pantalones: [
      'Pantalones técnicos diseñados para soportar condiciones extremas en montaña, con tejidos impermeables y costuras selladas.',
      'Su corte preformado en rodillas y caderas permite movimientos naturales al esquiar o practicar snowboard.',
      'Cuenta con bolsillos de fácil acceso, cremalleras impermeables y sistema de ventilación en la entrepierna.',
      'Incorpora polainas internas para evitar la entrada de nieve, manteniendo el calor en el interior durante largas sesiones.',
      'Refuerzos en zonas de mayor desgaste prolongan la vida útil incluso en uso intensivo y condiciones extremas.',
      'Tejido elástico que se adapta al cuerpo sin limitar la movilidad, ideal para sesiones prolongadas en pista.',
      'Incluye sistema de ajuste en cintura y trabillas para mayor compatibilidad con chaquetas técnicas y cascos.',
      'Perfecto para freeride y all-mountain, con diseño ergonómico que prioriza la comodidad en cada giro y descenso.',
      'Disponible en varios colores y tallas, ofreciendo versatilidad sin comprometer el rendimiento técnico de las pantalones.',
    ],
    Botas: [
      'Botas diseñadas para ofrecer una sujeción óptima y confort durante largas sesiones en la nieve, con interior térmico de ajuste anatómico.',
      'El sistema de cierre rápido permite un ajuste preciso en segundos, garantizando estabilidad y comodidad.',
      'Fabricadas con materiales resistentes al agua y al frío, protegen los pies en las condiciones más duras.',
      'Suela antideslizante con agarre optimizado para caminar sobre hielo o nieve compacta con total seguridad.',
      'Compatibles con la mayoría de fijaciones, estas botas combinan funcionalidad con un diseño atractivo y comodido.',
      'Refuerzos adicionales en el talón y tobillo aumentan la protección en caso de impactos o torsiones fuertes.',
      'Ideales tanto para principiantes como para expertos, proporcionan equilibrio entre control y flexibilidad.',
      'Revestimiento interior extraíble y lavable, lo que mejora la higiene y prolonga la vida útil de las botas.',
      'Tecnología de absorción de vibraciones que reduce el cansancio en jornadas prolongadas en la nieve y pista.',
    ],
    Snowboard: [
      'Tabla de snowboard construida con núcleo de madera ligera, combina durabilidad y flex para maniobras precisas en park o pista.',
      'Diseño twin tip simétrico ideal para riders que buscan versatilidad en todos los terrenos de montaña.',
      'Su sistema híbrido rocker-camber facilita el deslizamiento y mejora el control en nieve polvo y hielo.',
      'La base sinterizada asegura una excelente velocidad y resistencia a la abrasión en todo tipo de nieve.',
      'Perfil de flexión medio que equilibra respuesta y suavidad, ideal para principiantes avanzados y riders exigentes.',
      'Compatible con la mayoría de fijaciones, ofrece inserciones múltiples para personalizar tu postura y equilibrio.',
      'Acabado gráfico moderno y tratamiento superficial antiarañazos que mantiene la tabla como nueva durante largas sesiones.',
      'Cantos reforzados para mayor durabilidad en bordes y mejor tracción en condiciones difíciles como nieve húmeda.',
      'Diseñada para freestyle, all-mountain y riders que buscan progresar sin límites de velocidad o flexibilidad.',
    ],
    Esquí: [
      'Esquís de alto rendimiento para esquiadores que buscan control y agilidad en pista y fuera de pista.',
      'Diseño rocker en la espátula que mejora la flotación en nieve polvo y facilita los giros suaves en pista.',
      'Núcleo de madera con capas de fibra de vidrio para un equilibrio perfecto entre ligereza y resistencia.',
      'Su construcción tipo sándwich mejora la transmisión de energía en cada giro para un deslizamiento suave.',
      'Perfil sidecut progresivo que permite entradas y salidas suaves en curvas cerradas y abiertas en pista.',
      'Espátula y cola reforzadas con materiales que reducen las vibraciones a alta velocidad en pista compacta.',
      'Ideal para carving, freestyle o all-mountain, adaptándose a diferentes estilos y terrenos de montaña.',
      'Base duradera con alto deslizamiento para mantener velocidad incluso en nieve húmeda o polvo dificil.',
      'Diseñados para ofrecer estabilidad, precisión y fluidez en cualquier condición de nieve y pista compacta.',
    ],
};

  const opciones = base[categoria];
  if (!opciones || index >= opciones.length) {
    return `Producto de alta calidad para la nieve.`;
  }

  return `${opciones[index]}`;
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
        descripcionesMap.set(nombreBase, generarDescripcion(nombreBase, categoriaPrincipal, i));
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
