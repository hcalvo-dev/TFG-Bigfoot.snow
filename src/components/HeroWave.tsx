import { motion } from 'framer-motion';
import { CircleChevronDown } from 'lucide-react';

interface HeroWaveProps {
  imagen: string;
  alt: string;
  lineas: string[]; // Título dividido por líneas
  subtitulo?: string;
  href: string;
}

export default function HeroWave({ imagen, alt, lineas, subtitulo, href }: HeroWaveProps) {
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
            src={imagen}
            alt={alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest font-blowbrush mb-4">
            {lineas.map((linea, i) => (
              <span key={i} className="block">{linea}</span>
            ))}
          </h1>
          {subtitulo && (
            <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-widest">
              {subtitulo}
            </p>
          )}
        </div>

        <motion.a
          href={href}
          className="absolute z-20 bottom-[12%] left-1/2 transform -translate-x-1/2 bg-sky-9500/50 hover:bg-sky-950 p-2 rounded-xl transition duration-700 ease-in-out">
          <CircleChevronDown className="w-10 h-10 text-white" />
        </motion.a>
      </section>
    </div>
  );
}
