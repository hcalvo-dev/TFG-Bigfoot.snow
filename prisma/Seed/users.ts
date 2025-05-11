import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

export async function seedUsers() {  

  const users = ["Silvia", "Miguel", "Nill", "RoyLee", "Mariano", "Emilio"];
     // Hasheamos una contraseña genérica
  const hashedPassword = await bcrypt.hash('1A2a3a4a.', 10);

  // Creamos el usuario admin
  await prisma.usuario.create({
    data: {
      nombre: 'hcalvo',
      email: 'hcalvo@bigfoot.io',
      password: hashedPassword,
      estadoCuenta: true,
      rol: {
        connect: { nombre: 'admin' },
      },
    },
  });

  console.log('✅ Usuario admin creado');

   for (const nombre of users) {
    await prisma.usuario.create({
      data: {
        nombre,
        email: `${nombre.toLowerCase()}@gmail.com`,
        password: hashedPassword,
        estadoCuenta: true,
        rol: {
          connect: { nombre: 'user' },
        },
      },
    });
    console.log(`👤 Usuario ${nombre} creado`);
  }

  console.log('🎉 Seed de usuarios completado');
}
