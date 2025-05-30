import { motion, MotionValue } from 'framer-motion';
import TiltImageBlock from './TiltImageBlock';

type Props = {
  firstOpacity: MotionValue<number>;
  firstY: MotionValue<number>;
  secondOpacity: MotionValue<number>;
  secondY: MotionValue<number>;
};

export default function MobileContent({ firstOpacity, firstY, secondOpacity, secondY }: Props) {
  return (
    <motion.div className="block md:hidden relative w-full min-h-[400vh]">
      {/* Snowboard block */}
      <div className="sticky top-0 h-screen  flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-6 p-4"
          style={{ opacity: firstOpacity, y: firstY }}>
          <motion.a className="cursor-pointer" href="/equipos?snowboard" aria-label='Redirigir a la sección de snowboard'>
            <TiltImageBlock text="SNOW" image="/img/index/snowboard.webp" />
          </motion.a>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-4">SNOWBOARD</h2>
            <p className="text-gray-700">Domina la nieve con el mejor equipo de snowboard.</p>
          </div>
        </motion.div>
      </div>

      {/* Ski block */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-6 p-4"
          style={{ opacity: secondOpacity, y: secondY }}>
          <motion.a className="cursor-pointer" href="/equipos?skii" aria-label='Redirigir a la sección de esquí'>
            <TiltImageBlock text="SKI" image="/img/index/skii.webp" />
          </motion.a>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-4">ESQUÍ</h2>
            <p className="text-gray-700">Siente la velocidad en las mejores pistas de esquí.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
