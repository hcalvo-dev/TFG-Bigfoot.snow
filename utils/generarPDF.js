import PDFDocument from 'pdfkit';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function generarPDF(reservas, usuario,total) {
  console.log('[📄] Generando PDF con PDFKit...');

  const fechaActual = new Date().toISOString().split('T')[0];
  const nombreUsuario = (usuario?.nombre ?? 'usuario').toLowerCase().replace(/\s+/g, '-');
  const tempDir = path.resolve('./temp');
  const outputPath = path.join(tempDir, `resumen-${nombreUsuario}-${fechaActual}.pdf`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  //  Marca de agua
  const logoPath = path.resolve('./public/img/logo_1.svg');
  let logoBuffer;
  if (fs.existsSync(logoPath)) {
    logoBuffer = await sharp(logoPath)
      .resize(400)
      .png()
      .ensureAlpha()
      .modulate({ brightness: 1 })
      .toBuffer();
  }

  const dibujarMarcaAgua = () => {
    if (logoBuffer) {
      doc.save();
      doc.opacity(0.05);
      doc.image(logoBuffer, doc.page.width / 2 - 200, doc.page.height / 2 - 200, { width: 400 });
      doc.opacity(1);
      doc.restore();
    }
  };

  dibujarMarcaAgua();
  doc.on('pageAdded', dibujarMarcaAgua);

  //  Cabecera
  doc.font('Helvetica-Bold').fontSize(30).fillColor('#0c4a6e').text('Bigfoot', { align: 'center' });
  doc.moveDown(0.5);
  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .fillColor('#0c4a6e')
    .text('~~ Resumen de Reservas ~~', { align: 'center' });
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor('black')
    .text(`Cliente: ${usuario?.nombre ?? 'Usuario'}`);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`);
  doc.moveDown();

  for (const r of reservas) {
    const titulo = r.clase
      ? `Clase: ${r.clase.titulo}`
      : r.productos?.[0]
      ? `Producto: ${r.productos[0].producto.nombre}`
      : 'Reserva';

    const fechaInicio = new Date(r.fechaInicio).toLocaleString('es-ES');
    const fechaFin = new Date(r.fechaFin).toLocaleString('es-ES');
    const total_indvidual = r.total.toFixed(2);

    //  Dibuja el título primero
    doc.fontSize(16).fillColor('#0c4a6e').text(titulo, doc.page.margins.left, doc.y);
    doc.moveDown(0.3);

    //  Layout horizontal imagen + info
    const imagenPath = r.clase
      ? path.resolve('./public/img/clases/imgProducto.webp')
      : r.productos?.[0]?.producto?.imagenUrl
      ? path.resolve(`./public/${r.productos[0].producto.imagenUrl}`)
      : path.resolve('./public/img/clases/imgProducto.webp');

    const imageSize = 100;
    const gap = 20;
    const startY = doc.y;
    const imageX = doc.page.margins.left;
    const textX = imageX + imageSize + gap;
    let imageHeightUsed = 0;

    if (imagenPath && fs.existsSync(imagenPath)) {
      try {
        const buffer = await sharp(imagenPath).resize(imageSize, imageSize).png().toBuffer();
        doc.image(buffer, imageX, startY, { width: imageSize });
        imageHeightUsed = imageSize;
      } catch (err) {
        console.warn('⚠️ Error al procesar imagen', imagenPath);
      }
    }

    let yActual = startY + 10;
    doc.fontSize(12).fillColor('black').text(`${fechaInicio} - ${fechaFin}`, textX, yActual);
    yActual = doc.y + 5;

    doc.text(`Precio: ${total_indvidual} €`, textX, yActual);
    yActual = doc.y + 5;

    const tallas = r.productos?.[0]?.producto?.tallas;
    const medidas = r.productos?.[0]?.producto?.medidas;

    if (Array.isArray(tallas)) {
      const tallasValidas = tallas.filter((t) => t != null && t !== '');
      if (tallasValidas.length > 0) {
        doc.text(`Talla(s): ${tallasValidas.join(', ')}`, textX, yActual);
        yActual = doc.y + 5;
      }
    }

    if (Array.isArray(medidas)) {
      const medidasValidas = medidas.filter((m) => m != null && m !== '');
      if (medidasValidas.length > 0) {
        doc.text(`Medidas: ${medidasValidas.join(', ')}`, textX, yActual);
        yActual = doc.y + 5;
      }
    }

    // Avanzar a la siguiente ficha
    doc.y = Math.max(startY + imageHeightUsed, doc.y) + 20;
  }

  doc.moveDown(0.5);
  doc
    .strokeColor('#0c4a6e')
    .lineWidth(1)
    .moveTo(doc.page.margins.left, doc.y) // desde el margen izquierdo
    .lineTo(doc.page.width - doc.page.margins.right, doc.y) // hasta el margen derecho
    .stroke();
  doc.moveDown(1);
  
  doc
    .fontSize(14)
    .fillColor('#0c4a6e')
    .text(`Total: ${total.toFixed(2)} €`, { align: 'right' });

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return outputPath;
}
