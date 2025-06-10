import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import fsSync from 'fs';

export async function generarPDF(reservas, usuario) {
  try {
    console.log('[📄] Generando PDF con PDFKit...');

    const fechaActual = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const nombreUsuario = (usuario?.nombre ?? 'usuario').toLowerCase().replace(/\s+/g, '-');
    const tempDir = path.resolve('./temp');
    const outputPath = path.join(tempDir, `resumen-${nombreUsuario}-${fechaActual}.pdf`);

    if (!fsSync.existsSync(tempDir)) {
      fsSync.mkdirSync(tempDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(18).text(`Resumen de Reservas`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${usuario?.nombre ?? 'Usuario'}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    reservas.forEach((r) => {
      const nombre = r.clase ? `Clase: ${r.clase.titulo}` :
        r.productos?.[0] ? `Producto: ${r.productos[0].producto.nombre}` : 'Reserva';
      doc.text(`${nombre} (${new Date(r.fechaInicio).toLocaleString('es-ES')} - ${new Date(r.fechaFin).toLocaleString('es-ES')}) - ${r.total}€`);
    });

    const total = reservas.reduce((acc, r) => acc + r.total, 0);
    doc.moveDown().fontSize(14).text(`Total: ${total}€`);

    doc.end();

    // Esperar a que el stream termine antes de continuar
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return outputPath;
  } catch (error) {
    console.error('❌ Error al generar el PDF:', error);
    throw error;
  }
}
