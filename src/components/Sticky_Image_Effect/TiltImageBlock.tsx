import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

type Props = {
  text: string;
  image: string;
};

export default function TiltImageBlock({ text, image }: Props) {
  return (
    <Tilt
      tiltMaxAngleX={20}
      tiltMaxAngleY={20}
      glareEnable={true}
      glareMaxOpacity={0.4}
      glareColor="#155dfc"
      glarePosition="all"
      scale={1.08}
      transitionSpeed={2500}
      className="relative w-72 h-72 md:w-56 md:h-56 xl:w-80 xl:h-80 overflow-hidden bg-gray-300 rounded-xl shadow-2xl group"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        whileHover={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {text && (
          <h2 className="text-7xl xl:text-8xl font-extrabold text-blue-600 tracking-widest select-none">
            {text}
          </h2>
        )}
      </motion.div>
      <motion.img
        src={image}
        alt={text || "Tilt Image"}
        className="relative w-full h-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
      />
    </Tilt>
  );
}
