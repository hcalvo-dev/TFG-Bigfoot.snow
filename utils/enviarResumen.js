import { generarPDFReserva, generarPDFCancelación } from './generarPDF.js';
import { transporter } from './email.js';
import fs from 'fs/promises';

export async function enviarResumenPorEmailConReservas(reservas, usuario, total, resumenReserva) {
  try {
    let pdfPath="";
    if(resumenReserva){
      pdfPath = await generarPDFReserva(reservas, usuario,total);
      
      
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
          },
        ],
      });
    }else{
      pdfPath = await generarPDFCancelación(reservas, usuario,total);
      
  
      await transporter.sendMail({
        from: `"Bigfoot.snow" <${process.env.EMAIL_USER}>`,
        to: usuario.email,
        subject: 'Cancelación confirmada - Bigfoot.snow',
        text: `Hola ${usuario.nombre}, tu cancelación ha sido confirmada. Adjuntamos el resumen en PDF.`,
        attachments: [
          {
            filename: 'resumen-cancelación.pdf',
            path: pdfPath,
            contentType: 'application/pdf',
          },
        ],
      });
    }

    await fs.unlink(pdfPath);
  } catch (error) {
    console.error('❌ Error al enviar el resumen por email:', error);
    throw error;
  }
}