'use client';

import { useEffect, useState, useRef } from 'react';
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
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

  useEffect(() => {
    const calculateWidth = () => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth;
        const offsetWidth = carouselRef.current.offsetWidth;
        setWidth(-scrollWidth + offsetWidth);
      }
    };

    calculateWidth();

    const observer = new ResizeObserver(() => calculateWidth());
    if (carouselRef.current) observer.observe(carouselRef.current);

    window.addEventListener('resize', calculateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateWidth);
    };
  }, [clima]);

  if (!montana) {
    return (
      <p className="text-center text-gray-500 py-10">Selecciona una montaña para ver el clima.</p>
    );
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
          ''
        ) : (
          <AnimatePresence mode="wait">
            {!loading && (
              <div className="w-full overflow-x-hidden mt-8">
                <motion.div
                  key={montana.nombre}
                  ref={carouselRef}
                  className="flex gap-4 cursor-grab active:cursor-grabbing px-1 pb-4"
                  drag="x"
                  dragConstraints={{ left: width, right: 0 }}>
                  {clima.map((dia, i) => {
                    const fecha = new Date(dia.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'short',
                    });

                    return (
                      <motion.div
                        key={i}
                        className="min-w-[220px] bg-gradient-to-br from-sky-100 to-white rounded-3xl shadow-md p-6 text-center flex-shrink-0 border border-sky-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}>
                        <p className="text-md font-bold uppercase text-sky-800 tracking-wide mb-2">
                          {fecha}
                        </p>
                        <img
                          src={`https://openweathermap.org/img/wn/${dia.icono}@2x.png`}
                          alt={dia.descripcion}
                          className="w-20 h-20 flex justify-self-center drop-shadow-lg"
                          draggable={false}
                        />
                        <p className="capitalize text-base mt-2 text-sky-700 font-medium">
                          {dia.descripcion}
                        </p>
                        <div className="mt-3 text-md font-semibold">
                          <span className="text-blue-600">{dia.temperaturaMin}°C</span>{' '}
                          <span className="text-gray-400">/</span>{' '}
                          <span className="text-red-600">{dia.temperaturaMax}°C</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
