import { motion } from 'framer-motion';
import { Snowflake, GraduationCap, ImageIcon } from 'lucide-react';

export default function AboutUs() {
  return (
    <section className="w-full py-14 px-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12">
        <h2 className="text-5xl font-blowbrush font-extrabold text-sky-950 uppercase tracking-widest">
          Sobre Nosotros
        </h2>
      </motion.div>

      {/* Texto descriptivo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-600 text-18 max-w-3xl mx-auto text-center space-y-5 leading-relaxed">
        <p>
          En Bigfoot no solo ofrecemos material de nieve, creamos experiencias para quienes viven
          el deporte como una forma de vida. Nacimos en la Sierra con una visión clara: acercar la
          montaña a todos con estilo, actitud y confianza.
        </p>
        <p>
          Nuestro espíritu callejero, audaz y libre se respira en cada tabla, en cada clase y en
          cada detalle. Queremos que te sientas parte de una comunidad que rompe moldes, que no
          sigue huellas… sino que las deja. Bigfoot es mucho más que nieve: es identidad, es
          aventura, es calle.
        </p>
      </motion.div>

      {/* Bloques de íconos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-14 grid grid-cols-1 md:grid-cols-3 text-center gap-10">
        <div className="flex flex-col items-center gap-3">
          <Snowflake className="w-12 h-12 text-blue-700" />
          <span className="uppercase text-18 text-gray-400 font-semibold tracking-wider">Clima</span>
          <p className=" text-gray-500 max-w-xs">
            Aprovechamos al máximo las condiciones de la Sierra: nieve natural, cielos limpios y un entorno privilegiado que inspira cada aventura.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <GraduationCap className="w-12 h-12 text-blue-700" />
          <span className="uppercase text-18 text-gray-400 font-semibold tracking-wider">Aprendizaje</span>
          <p className=" text-gray-500 max-w-xs">
            Nuestro equipo de instructores no solo enseña, también contagia la pasión por la nieve con una metodología cercana y motivadora.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ImageIcon className="w-12 h-12 text-blue-700" />
          <span className="uppercase text-18 text-gray-400 font-semibold tracking-wider">Terreno</span>
          <p className=" text-gray-500 max-w-xs">
            Desde rutas freestyle hasta zonas de iniciación, cada pista está pensada para ofrecerte emoción y libertad sin importar tu nivel.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
