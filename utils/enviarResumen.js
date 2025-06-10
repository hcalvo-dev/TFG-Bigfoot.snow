import { generarPDF } from './generarPDF.js';
import { transporter } from './email.js';
import fs from 'fs/promises';

export async function enviarResumenPorEmailConReservas(reservas, usuario) {
  const pdfPath = await generarPDF(reservas, usuario);

  await transporter.sendMail({
    from: `"Bigfoot.snow" <${process.env.EMAIL_USER}>`,
    to: usuario.email,
    subject: 'Compra confirmada - Bigfoot.snow',
    text: `Hola ${usuario.nombre}, tu compra ha sido confirmada. Adjuntamos el resumen en PDF.`,
    attachments: [
      {
        filename: 'resumen-compra.pdf',
        path: pdfPath,
        contentType: 'application/pdf',
      }
    ]
  });

  await fs.unlink(pdfPath);
}