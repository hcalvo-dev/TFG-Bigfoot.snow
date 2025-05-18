import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const API_KEY = process.env.OPENWEATHER_KEY;

export async function actualizarClimaMontanas() {
  const montanas = await prisma.montaña.findMany(); // modelo con ñ

  for (const montana of montanas) {
    const { lat, lon } = montana;

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&lang=es&appid=${API_KEY}`;

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
        continue; // pasar a la siguiente montaña
      }

      const data = await res.json();

      for (const dia of data.daily.slice(0, 7)) {
        const fecha = new Date(dia.dt * 1000); 
        const temperaturaMax = dia.temp.max;
        const temperaturaMin = dia.temp.min;
        const descripcion = dia.weather[0].description;
        const icono = dia.weather[0].icon;

        await prisma.clima.upsert({
          where: {
            fecha_montañaId: {
              fecha,
              montañaId: montana.id
            }
          },
          update: {
            temperaturaMax,
            temperaturaMin,
            descripcion,
            icono
          },
          create: {
            fecha,
            montañaId: montana.id,
            temperaturaMax,
            temperaturaMin,
            descripcion,
            icono
          }
        });
      }

      console.log(`✔ Clima actualizado para ${montana.nombre}`);
    } catch (err) {
      console.error(`❌ Error al procesar ${montana.nombre}:`, err);
    }
  }

  console.log('🎉 Todas las montañas han sido procesadas.');
}
