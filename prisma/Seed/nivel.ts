import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedNiveles() {  
    const nivelesInstructor = [
      { nombre: 'A - Debutante', precio: 25 },
      { nombre: 'B - Principiante', precio: 30 },
      { nombre: 'C - Intermedio', precio: 35 },
      { nombre: 'D - Avanzado', precio: 40 },
      { nombre: 'E - Experto', precio: 45 },
      { nombre: 'F - Profesional', precio: 50 },
    ];
    for (const nivel of nivelesInstructor) {
    await prisma.nivel.upsert({
      where: { nombre: nivel.nombre },
      update: {},
      create: nivel,
    });
    console.log(`✅ Nivel creado o actualizado: ${nivel.nombre}`);
  }
}
