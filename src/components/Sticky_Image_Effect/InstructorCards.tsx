import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Instructor = {
  usuario: {
    nombre: string;
  };
  especialidad: string;
  nivelRel: {
    nombre: string;
  };
  montañas: {
    nombre: string;
  }[];
  testimonio: string;
  fotoUrl: string;
};

type InstructorObject = {
  name: string;
  designation: string;
  quote: string;
  src: string;
};

export default function InstructorCarousel() {
  const [instructores, setInstructores] = useState<InstructorObject[]>([]);
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % instructores.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + instructores.length) % instructores.length);
  };

  const isActive = (index: number) => index === active;

  useEffect(() => {
    const fetchInstructores = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/instructor/all');
        const data = (await res.json()) as Instructor[];

        const transformados = data.map((inst) => ({
          name: inst.usuario.nombre,
          designation: `Especialista en ${
            inst.especialidad.charAt(0).toUpperCase() + inst.especialidad.slice(1)
          }  – ${inst.montañas[0].nombre}`,
          quote: inst.testimonio || 'Sin testimonio disponible.',
          src: inst.fotoUrl,
        }));

        setInstructores(transformados);
      } catch (error) {
        console.error('Error al obtener instructores:', error);
      }
    };

    fetchInstructores();
  }, []);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  if (instructores.length === 0) return null;

  return (
    <div className="mx-auto max-w-sm px-4 pt-12 md:pt-20 md:pb-12 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto mb-12 px-4 text-center">
        <h2 className="text-4xl font-blowbrush tracking-widest font-extrabold mb-8 text-sky-950 uppercase">
          Nuestros Instructores
        </h2>
      </div>
      <div className="relative grid grid-cols-1 gap-8 md:gap-20 md:grid-cols-2">
        <div className="relative h-80 w-full">
          <AnimatePresence>
            {instructores.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index) ? 40 : instructores.length + 2 - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 origin-bottom">
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-top"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}>
            <h3 className="text-2xl font-bold text-sky-950">{instructores[active].name}</h3>
            <p className=" text-gray-600">{instructores[active].designation}</p>
            <motion.div className="mt-8 text-lg text-zinc-600">
              {instructores[active].quote.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                  animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                    delay: 0.02 * index,
                  }}
                  className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-900">
              <ArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-900">
              <ArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
