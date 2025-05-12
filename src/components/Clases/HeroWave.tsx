import { motion } from 'framer-motion';
import { CircleChevronDown } from 'lucide-react';

export default function HeroWave() {
  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      <section
        className="absolute inset-0 w-full h-full z-0"
        style={{
          clipPath: 'ellipse(120% 90% at 50% 0%)',
          WebkitClipPath: 'ellipse(120% 90% at 50% 0%)',
        }}>
        <div className="absolute inset-0 z-0">
          <img
            src="/img/clases/portada.webp"
            alt="Montaña nevada"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest font-blowbrush mb-4">
            ESCUELA DE <br /> SKII Y SNOWBOARD
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-widest">
            APRENDE, MEJORA Y... ¡DISFRUTA!
          </p>
        </div>
        {/* Botón justo encima de la curva */}
        <motion.a
          href="#contenido"
          className="absolute z-20 bottom-[12%] left-1/2 transform -translate-x-1/2 bg-sky-9500/50 hover:bg-sky-950 p-2 rounded-xl transition duration-700 ease-in-out">
          <CircleChevronDown className="w-10 h-10 text-white" />
        </motion.a>
      </section>
    </div>
  );
}
