import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PUBLIC_API_URL } from '../config';

type Montania = {
  id: number;
  nombre: string;
  ubicacion: string;
  altura: number;
  imagen: string;
};

export default function MontanasCarousel() {
  const [montanas, setMontanas] = useState<Montania[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const fetchMontanas = async () => {
      try {
        const res = await fetch(PUBLIC_API_URL + '/api/montanas/all');
        const data = await res.json();

        // Imaginamos que agregas aquí las imágenes fijas según el ID o el nombre
        const montanasConImagen = data.map((montana: Montania) => ({
          ...montana,
          imagen: `/img/montanas/${montana.nombre
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('í', 'i').
            replaceAll('ü', 'u')}.webp`,
        }));

        setMontanas(montanasConImagen);
      } catch (error) {
        console.error('Error al cargar montañas:', error);
      }
    };

    fetchMontanas();
  }, []);

  useEffect(() => {
    const calculateWidth = () => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth;
        const offsetWidth = carouselRef.current.offsetWidth;
        const maxScroll = scrollWidth - offsetWidth;
        setWidth(-maxScroll); // negativo para framer-motion
      }
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);

    return () => window.removeEventListener('resize', calculateWidth);
  }, [montanas]);

  return (
    <section className="w-full py-16 px-4">
      <h2 className="text-4xl font-extrabold font-blowbrush tracking-widest text-center mb-12 text-sky-950 uppercase">
        Explora Nuestras Montañas
      </h2>

      <div className="overflow-hidden relative">
        <motion.div
          ref={carouselRef}
          className="flex gap-6 cursor-grab active:cursor-grabbing px-1"
          drag="x"
          dragConstraints={{ left: width, right: 0 }}>
          {montanas.map((montana) => (
            <motion.div
              key={montana.id}
              className="relative w-[80%] md:w-[31%] h-[350px] rounded-3xl overflow-hidden flex-shrink-0">
              <img
                src={montana.imagen}
                alt={`Montaña - ${montana.nombre}`}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end text-white"
                style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.85)' }}>
                <h3 className="text-3xl font-blowbrush uppercase tracking-widest text-white drop-shadow-md">
                  {montana.nombre}
                </h3>
                <p className="text-md text-white/90 font-semibold">{montana.ubicacion}</p>
                <p className="text-sm text-white/70 font-medium mt-1">Altura: {montana.altura} m</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
