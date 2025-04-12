import type { APIRoute } from 'astro';
import prisma from '../../lib/prisma';

export const GET: APIRoute = async () => {
  const usuarios = await prisma.usuario.findMany();

  return new Response(JSON.stringify(usuarios), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
