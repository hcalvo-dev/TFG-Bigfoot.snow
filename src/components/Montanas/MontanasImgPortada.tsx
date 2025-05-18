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

export default function MontanasInteractive({
  onSeleccion,
}: {
  onSeleccion: (m: Montania) => void;
}) {
  const [montanas, setMontanas] = useState<Montania[]>([]);
  const [principal, setPrincipal] = useState<Montania | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const slugify = (str: string) =>
    str
      .normalize('NFD') // descompone tildes y diéresis
      .replace(/[\u0300-\u036f]/g, '') // elimina acentos y marcas diacríticas
      .toLowerCase()
      .replaceAll(' ', '-')
      .replace(/[^a-z0-9-]/g, ''); // elimina cualquier caracter extraño

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
  }, [montanas]);

  useEffect(() => {
    const fetchMontanas = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/montanas/all');
        const data = await res.json();

        const montanasConImagen = data.map((montana: Montania) => ({
          ...montana,
          imagen: `/img/montanas/${slugify(montana.nombre)}.webp`,
        }));

        setMontanas(montanasConImagen);

        const params = new URLSearchParams(window.location.search);
        const rawSlug = params.get('montana') || '';
        const slug = slugify(rawSlug);

        const slugsValidos = montanasConImagen.map((m: Montania) => slugify(m.nombre));
        const slugEsValido = slugsValidos.includes(slug);

        const seleccionada = slugEsValido
          ? montanasConImagen.find((m: Montania) => slugify(m.nombre) === slug)
          : null;

        const seleccion =
          seleccionada ||
          montanasConImagen.find((m: Montania) => slugify(m.nombre).includes('sierra-nevada')) ||
          montanasConImagen[0];

        setPrincipal(seleccion);
        onSeleccion(seleccion);
      } catch (error) {
        console.error('Error al cargar montañas:', error);
      }
    };

    fetchMontanas();
  }, []);

  const handleSeleccion = (montana: Montania) => {
    setPrincipal(montana);
    onSeleccion(montana);
  };

  const montanasRestantes = montanas.filter((m) => m.id !== principal?.id);

  return (
    <section className="w-full  min-h-screen px-6 py-12">
      <div className="text-center mt-8 max-w-3xl mx-auto mb-10">
        <h2 className="text-5xl font-blowbrush font-extrabold uppercase tracking-widest text-sky-950 mb-4">
          Selecciona nuestras montañas
        </h2>
        <p className="text-gray-600 text-lg font-medium">
          Haz clic sobre cualquiera de nuestras montañas para ver su información destacada.
        </p>
      </div>

      <div className="flex gap-8 mb-6 mx-auto max-w-6xl px-4 items-center justify-center">
        <div className="w-[50%] relative rounded-3xl overflow-hidden shadow-xl h-[45vh] md:h-[56vh]">
          <AnimatePresence mode="wait">
            {principal && (
              <motion.img
                key={principal.id}
                src={principal.imagen}
                alt={principal.nombre}
                className="w-full h-full object-cover object-bottom"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center w-[40%] text-sky-900 px-2">
          {principal && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4">
              <h3 className="text-4xl font-blowbrush font-bold uppercase tracking-widest">
                {principal.nombre}
              </h3>
              <p className="text-lg font-semibold">{principal.ubicacion}</p>
              {principal.descripcion && (
                <p className="text-gray-800 hidden md:block max-w-xl leading-relaxed">
                  {principal.descripcion}
                </p>
              )}
              <p className=" text-gray-800">Altura: {principal.altura} m</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="w-full hidden md:flex mt-8 gap-2 flex-wrap" style={{ height: '40vh' }}>
        {montanasRestantes.slice(0, 8).map((montana, idx) => (
          <div
            key={montana.id}
            onClick={() => handleSeleccion(montana)}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative group mx-auto cursor-pointer"
            style={{ height: '20vh', width: '24%' }}>
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-blue-600/10 rounded-2xl z-10"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
                />
              )}
            </AnimatePresence>

            <div className="relative w-full h-full z-20 overflow-hidden rounded-2xl border border-transparent group-hover:border-blue-600 transition">
              <img
                src={montana.imagen}
                alt={montana.nombre}
                className="w-full h-full object-cover object-bottom transition-all duration-300 grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center py-1  font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                {montana.nombre}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full md:hidden overflow-hidden mt-8">
        <motion.div
          ref={carouselRef}
          className="flex gap-4 px-2 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: width, right: 0 }}>
          {montanas.map((montana) => (
            <motion.div
              key={montana.id}
              className="relative max-w-[85%] h-[230px] rounded-3xl overflow-hidden flex-shrink-0"
              onClick={() => handleSeleccion(montana)}>
              <img
                src={montana.imagen}
                alt={montana.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center py-1 font-semibold z-30">
                  {montana.nombre}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
