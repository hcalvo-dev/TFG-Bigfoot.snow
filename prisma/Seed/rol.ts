import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedRoles() {  
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
