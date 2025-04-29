import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CableCar, Snowflake, SunSnow } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

export default function BrokenImageEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Opacidades controladas por scroll
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const dividerOpacity = useTransform(scrollYProgress, [0.32, 0.35], [0.6, 1]);
  const logosOpacity = useTransform(scrollYProgress, [0.26, 0.4], [0, 1]);
  const iconsOpacity = useTransform(scrollYProgress, [0.36, 0.42], [0, 1]);
  const rombosOpacity = useTransform(scrollYProgress, [0.40, 0.49], [0, 1]);
   
  // Opacidad para la versión móvil
  const firstMobileBlockOpacity = useTransform(scrollYProgress, [0.30, 0.4], [1, 0]);
  const firstMobileBlockY = useTransform(scrollYProgress, [0.30, 0.4], [0, -100]); // se desplaza hacia arriba al desaparecer
  const secondMobileBlockOpacity = useTransform(scrollYProgress, [0.4, 0.59], [0, 1]);
  const secondMobileBlockY = useTransform(scrollYProgress, [0.4, 0.59], [100, 0]); // entra desde abajo

  return (
    <section ref={containerRef} className="relative w-full min-h-[500vh]">

      {/* Sticky principal */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <motion.div className="absolute w-full h-full" style={{ opacity: imageOpacity }}>
          <img src="/img/index/prueba.webp" alt="Imagen principal" className="w-full h-full object-cover" />
        </motion.div>

        {/* Marquee */}
        <motion.div className="absolute w-full overflow-hidden top-[80%] z-20" style={{ opacity: marqueeOpacity }}>
          <div className="flex whitespace-nowrap animate-marquee opacity-65">
            {Array(2).fill(0).map((_, index) => (
              <motion.div
                key={index}
                className="flex"
                initial={{ x: index === 0 ? "0%" : "100%" }}
                animate={{ x: "-100%" }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 50,
                  ease: "linear"
                }}
              >
                {Array(4).fill(0).map((_, i) => (
                  <h2 key={i} className="text-[6rem] font-extrabold tracking-widest flex mr-20">
                    <span className="text-blue-600">BIG</span>
                    <span className="text-transparent stroke-2 stroke-black ml-4">FOOT</span>
                    <span className="text-blue-600 ml-8">SNOW</span>
                    <span className="text-transparent stroke-2 stroke-black ml-4">SKI</span>
                  </h2>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Texto principal */}
        <motion.div className="relative z-10 text-center" style={{ opacity: textOpacity }}>
          <h1 className="text-5xl md:text-7xl font-blowbrush font-bold text-zinc-900 tracking-widest">
            DOMINA LA NIEVE!<br />VIVE LA CALLE
          </h1>
        </motion.div>
      </div>

      {/* --- Desktop content (línea central) --- */}
      <motion.div
        className="relative w-full min-h-[400vh] hidden md:flex flex-col items-center justify-start"
        style={{ opacity: dividerOpacity }}
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-start h-full">

            {/* Puntos iniciales */}
            <div className="relative flex flex-col items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black mt-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-black mt-1" />
              <div className="w-3.5 h-3.5 rounded-full bg-black mt-1 -mb-3" /> 
            </div>

            {/* Línea vertical */}
            <div className="w-[4px] bg-black flex-1" />

            {/* Logos */}
            {[
              { top: "20%" },
              { top: "40%" },
              { top: "60%" },
              { top: "80%" },
            ].map((pos, index) => (
              <motion.div
                key={index}
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md"
                style={{ top: pos.top, opacity: logosOpacity }}
              >
                {index === 0 ? (
                  <img src="/img/logo_1.svg" alt={`Logo ${index}`} className="w-18 h-18" />
                ) : (
                  <div />
                )}
              </motion.div>
            ))}

            {/* Iconos */}
            {[
              { top: "40%", Icon: CableCar },
              { top: "60%", Icon: Snowflake },
              { top: "80%", Icon: SunSnow },
            ].map(({ top, Icon }, index) => (
              <motion.div
                key={index}
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ top, opacity: iconsOpacity }}
              >
                <Icon size={48} className="text-gray-600" />
              </motion.div>
            ))}

            {/* Puntos finales */}
            <div className="flex flex-col items-center gap-1 mb-4">
              <div className="w-3.5 h-3.5 rounded-full bg-black -mt-3"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-black mt-1"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-black mt-1"></div>
            </div>
          </div>

          <motion.div
          className="absolute top-1/2 left-2/16  transform -translate-y-1/2 flex flex-col items-center gap-4"
          style={{ opacity: rombosOpacity }}
                >

          <Tilt
          tiltMaxAngleX={20}
          tiltMaxAngleY={20}
          glareEnable={true}
          glareMaxOpacity={0.4}
          glareColor="#155dfc" 
          glarePosition="all"
          scale={1.08}
          transitionSpeed={2500}
          className="relative w-80 h-80 rotate-[-12deg] overflow-hidden bg-gray-300 rounded-xl shadow-2xl group"
          >
            {/* Texto de fondo que aparece en hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 0.75, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-7xl md:text-8xl font-extrabold text-blue-600 tracking-widest select-none">
                SNOW
              </h2>
            </motion.div>

            {/* Imagen encima */}
            <motion.img
              src="/img/index/snowboard.webp"
              alt="Snowboard"
              className="relative w-full h-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
            />
          </Tilt>
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-1/10 transform -translate-y-1/2 flex flex-col items-center gap-4"
          style={{ opacity: rombosOpacity }}
        >

          <Tilt
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            glareEnable={true}
            glareMaxOpacity={0.4}
            glareColor="#155dfc" 
            glarePosition="all"
            scale={1.08}
            transitionSpeed={2500}
            className="relative w-80 h-80 rotate-[12deg] overflow-hidden bg-gray-300 rounded-xl shadow-2xl group"
          >
            {/* Texto de fondo que aparece en hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 0.75, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-7xl md:text-9xl font-extrabold text-blue-600 tracking-widest select-none">
                SKI
              </h2>
            </motion.div>

            {/* Imagen encima */}
            <motion.img
              src="/img/index/skii.webp"
              alt="Ski"
              className="relative w-full h-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
            />
          </Tilt>
        </motion.div>

        </div>
      </motion.div>

      {/* --- Mobile content (bloques) --- */}
      <motion.div
        className="block md:hidden relative w-full min-h-[400vh]"
      >
      {/* Primer bloque: Snowboard */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-6 p-4"
          style={{ opacity: firstMobileBlockOpacity, y: firstMobileBlockY }}
        >
          <Tilt
          tiltMaxAngleX={20}
          tiltMaxAngleY={20}
          glareEnable={true}
          glareMaxOpacity={0.4}
          glareColor="#155dfc" 
          glarePosition="all"
          scale={1.08}
          transitionSpeed={2500}
          className="relative w-80 h-80 overflow-hidden bg-gray-300 rounded-xl shadow-2xl group"
          >
            {/* Texto de fondo que aparece en hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 0.75, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              
            </motion.div>

            {/* Imagen encima */}
            <motion.img
              src="/img/index/snowboard.webp"
              alt="Snowboard"
              className="relative w-full h-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
            />
          </Tilt>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-4">SNOWBOARD</h2>
            <p className="text-gray-700">Domina la nieve con el mejor equipo de snowboard.</p>
          </div>
        </motion.div>
      </div>

      {/* Segundo bloque: Ski */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-6 p-4"
          style={{ opacity: secondMobileBlockOpacity, y: secondMobileBlockY }}
        >
          <Tilt
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            glareEnable={true}
            glareMaxOpacity={0.4}
            glareColor="#155dfc" 
            glarePosition="all"
            scale={1.08}
            transitionSpeed={2500}
            className="relative w-80 h-80  overflow-hidden bg-gray-300 rounded-xl shadow-2xl group"
          >
            {/* Texto de fondo que aparece en hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 0.75, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              
            </motion.div>

            {/* Imagen encima */}
            <motion.img
              src="/img/index/skii.webp"
              alt="Ski"
              className="relative w-full h-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
            />
          </Tilt>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-4">ESQUÍ</h2>
            <p className="text-gray-700">Siente la velocidad en las mejores pistas de esquí.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>

    </section>
  );
}
