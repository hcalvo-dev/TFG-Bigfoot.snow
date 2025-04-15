import type { APIRoute } from 'astro';
import prisma from '../../lib/prisma'; // ✅ IMPORTACIÓN CORRECTA

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();
  const form = new URLSearchParams(rawBody);

  const usuarioId = Number(form.get('usuarioId'));
  const fechaInicio = form.get('fechaInicio') as string;
  const fechaFin = form.get('fechaFin') as string;
  const productoId = form.get('productoId') ? Number(form.get('productoId')) : undefined;
  const claseId = form.get('claseId') ? Number(form.get('claseId')) : undefined;

  try {
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    
    if (!usuarioExiste) {
      return new Response(`<p>El usuario con ID ${usuarioId} no existe</p>`, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }
    
    console.log('Datos recibidos:', {
      usuarioId,
      fechaInicio,
      fechaFin,
      productoId,
      claseId,
    });
    

    // 🧠 EL MODELO 'reserva' SÍ EXISTE
    const reserva = await prisma.reserva.create({
      data: {
        "fechaInicio": new Date(fechaInicio),
        "fechaFin": new Date(fechaFin),
        "usuarioId": usuarioId,
        "claseId": claseId ?? null,
        "productoId": productoId ?? null,
      },
    });

    return new Response(
      `<p>Reserva creada con éxito. ID: ${reserva.id}</p><a href="/reservar">Volver</a>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    const e = error as Error;
    return new Response(`<p>Error: ${e.message}</p>`, {
      status: 400,
      headers: { "Content-Type": "text/html" }
      
    });
  }
};
