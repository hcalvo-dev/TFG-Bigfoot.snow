import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export async function generarPDF(reservas, usuario) {
  try {
    console.log('[📝] Generando HTML del PDF...');
    const htmlPath = path.resolve('./pdf/resumen.html');
    const cssPath = path.resolve('./pdf/styles.css');

    const htmlBase = await fs.readFile(htmlPath, 'utf-8');
    const css = await fs.readFile(cssPath, 'utf-8');

    const listaItems = reservas
      .map((r) => {
        let nombre = 'Reserva';
        if (r.clase) nombre = `Clase: ${r.clase.titulo}`;
        else if (r.productos?.length > 0) nombre = `Producto: ${r.productos[0].producto.nombre}`;

        return `<li>${nombre} (${r.fechaInicio.toLocaleString(
          'es-ES'
        )} - ${r.fechaFin.toLocaleString('es-ES')}) - ${r.total}€</li>`;
      })
      .join('');

    const total = reservas.reduce((acc, r) => acc + r.total, 0);

    let html = htmlBase
      .replace('{{cliente}}', usuario?.nombre ?? 'Usuario')
      .replace('{{fecha}}', new Date().toLocaleDateString())
      .replace('{{items}}', listaItems)
      .replace('{{total}}', total);

    html = html.replace('</head>', `<style>${css}</style></head>`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    console.log('[📄] Generando PDF con Puppeteer...');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const fechaActual = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const nombreUsuario = (usuario?.nombre ?? 'usuario').toLowerCase().replace(/\s+/g, '-');
    const outputPath = `./temp/resumen-${nombreUsuario}-${fechaActual}.pdf`;
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });

    await browser.close();
    return outputPath;
  } catch (error) {
    console.error('❌ Error al generar el PDF:', error);
    throw error;
  }
}
