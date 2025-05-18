import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const API_KEY = process.env.OPENWEATHER_KEY;

export async function actualizarClimaMontanas() {
  console.log('🌍 Iniciando actualización del clima...');
  console.log('🔑 API_KEY:', API_KEY);

  if (!API_KEY) {
    console.error('❌ No se encontró la clave API en el entorno');
    return;
  }

  const montanas = await prisma.montaña.findMany();
  console.log(`🔎 Montañas encontradas: ${montanas.length}`);

  for (const montana of montanas) {
    const { lat, lon, nombre } = montana;
    console.log(`📍 Procesando ${nombre} → lat: ${lat}, lon: ${lon}`);

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&lang=es&appid=${API_KEY}`;

    console.log('🌐 URL generada:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`❌ Error al obtener datos de OpenWeather (${res.status}): ${text}`);
        continue;
      }

      const data = await res.json();
      console.log(`📦 Datos recibidos para ${nombre}:`, data.daily?.length, 'días');

      for (const dia of data.daily.slice(0, 7)) {
        const fecha = new Date(dia.dt * 1000);
        const temperaturaMax = dia.temp.max;
        const temperaturaMin = dia.temp.min;
        const descripcion = dia.weather[0].description;
        const icono = dia.weather[0].icon;

        console.log(
          `📅 Día: ${fecha.toISOString()}, Max: ${temperaturaMax}, Min: ${temperaturaMin}, Desc: ${descripcion}, Icono: ${icono}`
        );

        await prisma.clima.upsert({
          where: {
            fecha_montañaId: {
              fecha,
              montañaId: montana.id,
            },
          },
          update: {
            temperaturaMax,
            temperaturaMin,
            descripcion,
            icono,
          },
          create: {
            fecha,
            montañaId: montana.id,
            temperaturaMax,
            temperaturaMin,
            descripcion,
            icono,
          },
        });

        console.log(`✅ Clima guardado para ${nombre} en ${fecha.toISOString()}`);
      }

      console.log(`✔ Clima actualizado para ${nombre}`);
    } catch (err) {
      console.error(`❌ Error al procesar ${nombre}:`, err);
    }
  }

  console.log('🎉 Todas las montañas han sido procesadas.');
}
