import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import fsSync from 'fs';
import fsPromises from 'fs/promises';
import sharp from 'sharp';

export async function generarPDF(reservas, usuario) {
  try {
    console.log('[📄] Generando PDF con PDFKit...');

    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreUsuario = (usuario?.nombre ?? 'usuario').toLowerCase().replace(/\s+/g, '-');
    const tempDir = path.resolve('./temp');
    const outputPath = path.join(tempDir, `resumen-${nombreUsuario}-${fechaActual}.pdf`);

    if (!fsSync.existsSync(tempDir)) {
      fsSync.mkdirSync(tempDir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Logo como marca de agua
    const logoOriginal = path.resolve('./public/img/logo_1.svg');
    const logoConvertido = path.join(tempDir, 'logo_1.png');

    if (fsSync.existsSync(logoOriginal)) {
      await sharp(logoOriginal).png().toFile(logoConvertido);
      doc.image(logoConvertido, 150, 300, { width: 300, opacity: 0.1 });
    }

    doc.fontSize(20).fillColor('#0c4a6e').text('Bigfoot.snow - Resumen de Reservas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).fillColor('black').text(`Cliente: ${usuario?.nombre ?? 'Usuario'}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`);
    doc.moveDown();

    for (const [i, r] of reservas.entries()) {
      const titulo = r.clase ? `Clase: ${r.clase.titulo}` :
        r.productos?.[0] ? `Producto: ${r.productos[0].producto.nombre}` : 'Reserva';

      const fechaInicio = new Date(r.fechaInicio).toLocaleString('es-ES');
      const fechaFin = new Date(r.fechaFin).toLocaleString('es-ES');
      const total = r.total.toFixed(2);

      // Imagen original
      const imagen = r.clase
        ? path.resolve('./public/img/clases/imgProducto.webp')
        : r.productos?.[0]?.producto?.imagen
        ? path.resolve(`./public/img/productos/${r.productos[0].producto.imagen}`)
        : null;

      // Si la imagen existe, convertirla a PNG temporal
      if (imagen && fsSync.existsSync(imagen)) {
        const imagenTemp = path.join(tempDir, `imagen_${i}.png`);
        try {
          await sharp(imagen).resize(100, 100, { fit: 'inside' }).png().toFile(imagenTemp);
          doc.image(imagenTemp, { fit: [100, 100] }).moveDown(0.5);
        } catch (err) {
          console.warn(`⚠️ No se pudo procesar imagen ${imagen}:`, err.message);
        }
      }

      // Detalles de reserva
      doc.fontSize(14).fillColor('#0c4a6e').text(titulo);
      doc.fontSize(10).fillColor('black').text(`${fechaInicio} - ${fechaFin}`);
      doc.text(`Precio: ${total} €`);
      if (r.talla?.length) doc.text(`Talla(s): ${r.talla.join(', ')}`);
      if (r.medidas?.length) doc.text(`Medidas: ${r.medidas.join(', ')}`);
      doc.moveDown(1);
    }

    const totalFinal = reservas.reduce((acc, r) => acc + r.total, 0);
    doc.fontSize(14).fillColor('#0c4a6e').text(`Total: ${totalFinal.toFixed(2)} €`, { align: 'right' });

    doc.end();

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
