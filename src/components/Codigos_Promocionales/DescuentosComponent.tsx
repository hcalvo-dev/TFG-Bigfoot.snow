'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgePercent, Frown } from 'lucide-react';

type Descuento = {
  id: number;
  codigo: string;
  descripcion: string;
  porcentaje: number;
  aplicaEn: string;
  fechaValidez: string;
};

export default function DescuentosComponent() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/descuentos/all')
      .then((res) => res.json())
      .then((data) => setDescuentos(data))
      .catch((err) => console.error('Error al cargar descuentos:', err));
  }, []);

  return (
    <section className="w-full py-14 px-6 max-w-6xl mx-auto">
      {/* Título principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12">
        <h2 className="text-5xl font-blowbrush mt-8 font-extrabold text-sky-950 uppercase tracking-widest">
          Códigos Descuento
        </h2>
      </motion.div>

      {/* Texto descriptivo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-600 text-standard max-w-3xl mx-auto text-center space-y-5 leading-relaxed mb-12">
        <p>
          En Bigfoot premiamos a quienes forman parte de nuestra comunidad. Usa estos códigos en el
          momento de reservar tus clases o alquilar tu material.
        </p>
        <p>
          <strong>Los códigos se canjean exclusivamente desde el carrito de compra.</strong>
        </p>
        {descuentos.length > 0 && <p>¡Aprovecha estas promociones mientras estén activas!</p>}
      </motion.div>

      {/* Contenido dinámico */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-18">
        {descuentos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {descuentos.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
                <BadgePercent className="w-10 h-10 text-blue-700 mb-3" />
                <h3 className="text-xl font-bold text-sky-800 uppercase tracking-wide">
                  {d.codigo}
                </h3>
                <p className="text-gray-600 mt-2">{d.descripcion}</p>
                <p className="text-18 text-gray-500 mt-1">Descuento: {d.porcentaje}%</p>
                <p className="text-18 text-gray-500">Aplicable en: {d.aplicaEn}</p>
                <p className=" text-gray-400 mt-2">
                  Válido hasta: {new Date(d.fechaValidez).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-10 space-y-4">
            <Frown className="w-16 h-16 text-blue-400" />
            <p className="text-lg font-semibold">
              Actualmente no disponemos de ningún código descuento activo.
            </p>
            <p className="text-18">¡Vuelve pronto para más sorpresas!</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
