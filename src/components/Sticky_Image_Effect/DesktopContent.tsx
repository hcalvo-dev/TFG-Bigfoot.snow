import { motion, MotionValue } from 'framer-motion';
import { CableCar, Snowflake, SunSnow  } from 'lucide-react';
import TiltImageBlock from './TiltImageBlock';

const navLinks = ['forfait', 'equipos', 'weather'];

type Props = {
  dividerOpacity: MotionValue<number>;
  logosOpacity: MotionValue<number>;
  iconsOpacity: MotionValue<number>;
  rombosOpacity: MotionValue<number>;
};

export default function DesktopContent({ dividerOpacity, logosOpacity, iconsOpacity, rombosOpacity }: Props) {
  return (
    <motion.div className="relative w-full min-h-[300vh] hidden md:flex flex-col items-center" style={{ opacity: dividerOpacity }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="relative flex flex-col items-center justify-start h-full">
          {/* Puntos y línea central */}
          <div className="relative flex flex-col items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-black mt-1" />
            <div className="w-3.5 h-3.5 rounded-full bg-black mt-1 -mb-3" />
          </div>
          <div className="w-[4px] bg-black flex-1" />
          {/* Logos */}
          {[{ top: "20%" }, { top: "40%" }, { top: "60%" }, { top: "80%" }].map((pos, i) => (
            <motion.div key={i} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-18 md:h-18 xl:w-20 xl:h-20 rounded-full bg-white flex items-center justify-center shadow-md" style={{ top: pos.top, opacity: logosOpacity }}>
              {i === 0 && <img src="/img/logo_1.svg" alt={`Logo ${i}`} className="md:w-14 md:h-14 xl:w-18 xl:h-18" />}
            </motion.div>
          ))}
          {/* Iconos */}
          {[{ top: "40%", Icon: CableCar }, { top: "60%", Icon: Snowflake }, { top: "80%", Icon: SunSnow }].map(({ top, Icon }, i) => (
  <div
    key={i}
    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
    style={{ top }}
  >
    <motion.a
      href={`#${navLinks[i]}`}
      whileHover={{ scale: 1.1 }}
      className="origin-center md:w-18 md:h-18 xl:w-20 xl:h-20 rounded-full bg-white hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center shadow-md group"
      style={{ opacity: iconsOpacity }}
    >
      <Icon className="text-gray-600 group-hover:text-white transition-colors duration-300 w-10 h-10 md:w-10 md:h-10 xl:w-12 xl:h-12" />
    </motion.a>
  </div>
))}    
          <div className="flex flex-col items-center gap-1 mb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-black -mt-3" />
            <div className="w-2.5 h-2.5 rounded-full bg-black mt-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1" />
          </div>
        </div>

        {/* Tilt blocks */}
        <motion.div className="absolute rotate-[-12deg] top-1/2 left-[12.5%] -translate-y-1/2" style={{ opacity: rombosOpacity }}>
          <TiltImageBlock text="SNOW" image="/img/index/snowboard.webp" />
        </motion.div>

        <motion.div className="absolute rotate-[12deg] top-1/2 right-[12.5%] -translate-y-1/2" style={{ opacity: rombosOpacity }}>
          <TiltImageBlock text="SKI" image="/img/index/skii.webp" />
        </motion.div>
      </div>
    </motion.div>
  );
}
