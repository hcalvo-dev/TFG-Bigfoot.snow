'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Montania = {
  id: number;
  nombre: string;
  ubicacion: string;
  altura: number;
  descripcion?: string;
  imagen: string;
};

type Clima = {
  fecha: string;
  temperaturaMax: number;
  temperaturaMin: number;
  descripcion: string;
  icono: string;
};

export default function WeatherMontanas({ montana }: { montana: Montania | null }) {
  const [csrfToken, setCsrfToken] = useState('');
  const [clima, setClima] = useState<Clima[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include',
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error('Error al obtener CSRF token:', err);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchClima = async () => {
      if (!montana || !csrfToken) return;

      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/clima/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({ nombre: montana.nombre }),
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setClima(data);
      } catch (err) {
        console.error('Error al obtener el clima:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClima();
  }, [csrfToken, montana]);

  if (!montana) {
    return <p className="text-center text-gray-500 py-10">Selecciona una montaña para ver el clima.</p>;
  }

  return (
    <section className="w-full px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h3 className="text-5xl font-blowbrush font-extrabold uppercase text-sky-950 tracking-widest mb-2">
            Condiciones en Ruta
          </h3>
          <p className="text-gray-600 text-lg font-medium">Pronóstico del tiempo (7 días)</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando clima...</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={montana.nombre}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-4"
            >
              {clima.map((dia, i) => {
                const fecha = new Date(dia.fecha).toLocaleDateString('es-ES', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                });

                return (
                  <motion.div
                    key={i}
                    className="bg-white rounded-2xl shadow-md p-4 text-center flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <p className="text-sm font-semibold text-gray-600">{fecha}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${dia.icono}@2x.png`}
                      alt={dia.descripcion}
                      className="w-16 h-16"
                    />
                    <p className="capitalize text-sm text-gray-700">{dia.descripcion}</p>
                    <div className="mt-2 text-sm">
                      <span className="text-blue-700 font-semibold">{dia.temperaturaMin}°C</span>{' '}
                      / <span className="text-red-700 font-semibold">{dia.temperaturaMax}°C</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
