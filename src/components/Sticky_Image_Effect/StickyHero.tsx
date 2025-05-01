import { motion, MotionValue } from 'framer-motion';

type Props = {
  imageOpacity: MotionValue<number>;
  textOpacity: MotionValue<number>;
  marqueeOpacity: MotionValue<number>;
};

export default function StickyHero({ imageOpacity, textOpacity, marqueeOpacity }: Props) {
  return (
    <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute w-full h-full" style={{ opacity: imageOpacity }}>
        <img src="/img/index/prueba.webp" alt="Imagen principal" className="w-full h-full object-cover" />
      </motion.div>

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

      <motion.div className="relative z-10 text-center" style={{ opacity: textOpacity }}>
        <h1 className="text-5xl md:text-7xl font-blowbrush font-bold text-zinc-900 tracking-widest">
          DOMINA LA NIEVE!<br />VIVE LA CALLE
        </h1>
      </motion.div>
    </div>
  );
}
