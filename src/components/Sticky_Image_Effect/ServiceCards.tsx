'use client';

import { motion } from 'framer-motion';

const servicios = [
  {
    titulo: 'Alquiler de material',
    descripcion: 'Todo el equipo que necesitas: esquís, tablas, botas y más.',
    imagen: '/img/index/services/material.webp',
  },
  {
    titulo: 'Forfaits',
    descripcion: 'Consigue tus pases diarios o de temporada al mejor precio.',
    imagen: '/img/index/services/forfaits.webp',
  },
  {
    titulo: 'Reserva de clases',
    descripcion: 'Clases personalizadas con los mejores instructores en la Sierra.',
    imagen: '/img/index/services/clases.webp',
  },
  {
    titulo: 'Montañas',
    descripcion: 'Explora las rutas y pistas más populares de nuestras estaciones.',
    imagen: '/img/index/services/montana.webp',
  },
];

export default function ServiceCards() {
  return (
    <div className="relative flex flex-col items-center justify-center py-13 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-7xl">
        {servicios.map((servicio, i) => {
          const rotate = i === 0 ? 'xl:-rotate-[10deg]' :
                         i === 1 ? 'xl:-rotate-[3deg]' :
                         i === 2 ? 'xl:rotate-[3deg]' :
                         i === 3 ? 'xl:rotate-[10deg]' : '';

          const translateY = i === 0 ? 'xl:translate-y-12' :
                             i === 1 ? 'xl:translate-y-2' :
                             i === 2 ? 'xl:translate-y-2' :
                             i === 3 ? 'xl:translate-y-12' : '';

          return (
            <motion.div
              key={i}
              className={`bg-white p-6 rounded-3xl mx-auto shadow-xl w-full xl:w-[90%] min-h-[280px] text-center transition-transform
                ${rotate} ${translateY}`}>
              <img
                src={servicio.imagen}
                alt={`Servicio de ${servicio.titulo}`}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />
              <h3 className="text-xl font-bold text-sky-900 mb-3">{servicio.titulo}</h3>
              <p className="text-gray-600 text-sm">{servicio.descripcion}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
