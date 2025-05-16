import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

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
        const res = await fetch('http://localhost:4000/api/montanas/all');
        const data = await res.json();

        // Imaginamos que agregas aquí las imágenes fijas según el ID o el nombre
        const montanasConImagen = data.map((montana: Montania) => ({
          ...montana,
          imagen: `/img/montanas/${montana.nombre
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('í', 'i')}.webp`,
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
  }, []);

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
              className="relative w-[80%] md:w-[33%] h-[350px] rounded-3xl overflow-hidden flex-shrink-0">
              <img
                src={montana.imagen}
                alt={montana.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-blowbrush">{montana.nombre}</h3>
                <p className="text-sm text-white/80">{montana.ubicacion}</p>
                <p className="text-xs text-white/60 mt-1">Altura: {montana.altura} m</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
