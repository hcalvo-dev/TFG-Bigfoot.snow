import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedMontañasYRutas() {  
    const montanas = [
        {
          nombre: 'Baqueira Beret',
          ubicacion: 'Pirineos',
          altura: 2610,
          descripcion: 'Una de las estaciones más grandes y populares de España.',
          rutas: [
            { nombre: 'Mirador', dificultad: 'fácil', longitud: 3.2 },
            { nombre: 'Dossau', dificultad: 'media', longitud: 4.5 },
            { nombre: 'Escornacrabes', dificultad: 'difícil', longitud: 2.1 },
          ]
        },
        {
          nombre: 'Formigal',
          ubicacion: 'Pirineos',
          altura: 2250,
          descripcion: 'Estación aragonesa con gran variedad de pistas.',
          rutas: [
            { nombre: 'Anayet', dificultad: 'media', longitud: 3.8 },
            { nombre: 'Tres Hombres', dificultad: 'difícil', longitud: 2.5 },
          ]
        },
        {
          nombre: 'Cerler',
          ubicacion: 'Pirineos',
          altura: 2630,
          descripcion: 'La estación más alta del Pirineo aragonés.',
          rutas: [
            { nombre: 'Gallinero', dificultad: 'difícil', longitud: 3.1 },
            { nombre: 'El Molino', dificultad: 'fácil', longitud: 2.9 },
          ]
        },
        {
          nombre: 'Boí Taüll',
          ubicacion: 'Pirineos',
          altura: 2750,
          descripcion: 'Ideal para esquiadores avanzados.',
          rutas: [
            { nombre: 'Vaques', dificultad: 'media', longitud: 3.0 },
            { nombre: 'La Serra', dificultad: 'difícil', longitud: 2.7 },
          ]
        },
        {
          nombre: 'Navacerrada',
          ubicacion: 'Sistema Central',
          altura: 2177,
          descripcion: 'Estación cercana a Madrid con encanto.',
          rutas: [
            { nombre: 'El Bosque', dificultad: 'fácil', longitud: 1.8 },
            { nombre: 'Guarramillas', dificultad: 'media', longitud: 2.3 },
          ]
        },
        {
          nombre: 'Valdesquí',
          ubicacion: 'Sistema Central',
          altura: 2280,
          descripcion: 'Otra opción popular cerca de Madrid.',
          rutas: [
            { nombre: 'Peñalara', dificultad: 'media', longitud: 3.4 },
            { nombre: 'Valcotos', dificultad: 'fácil', longitud: 2.1 },
          ]
        },
        {
          nombre: 'San Isidro',
          ubicacion: 'Cordillera Cantábrica',
          altura: 2020,
          descripcion: 'Estación leonesa con pistas variadas.',
          rutas: [
            { nombre: 'Requejines', dificultad: 'media', longitud: 2.8 },
            { nombre: 'Peña del Sol', dificultad: 'difícil', longitud: 2.2 },
          ]
        },
        {
          nombre: 'Leitariegos',
          ubicacion: 'Cordillera Cantábrica',
          altura: 1800,
          descripcion: 'Pequeña estación familiar.',
          rutas: [
            { nombre: 'La Mora', dificultad: 'fácil', longitud: 1.5 },
            { nombre: 'El Cerezal', dificultad: 'media', longitud: 2.0 },
          ]
        },
        {
          nombre: 'Sierra Nevada',
          ubicacion: 'Granada',
          altura: 3398,
          descripcion: 'La estación más meridional de Europa.',
          rutas: [
            { nombre: 'El Aguila', dificultad: 'fácil', longitud: 6.0 },
            { nombre: 'Zahareña', dificultad: 'difícil', longitud: 4.0 },
          ]
        },
      ];
    
      for (const montana of montanas) {
        const createdMontana = await prisma.montaña.create({
          data: {
            nombre: montana.nombre,
            ubicacion: montana.ubicacion,
            altura: montana.altura,
            descripcion: montana.descripcion,
            rutas: {
              create: montana.rutas
            }
          }
        });
        console.log(`✅ Montaña creada: ${createdMontana.nombre}`);
      }
}
