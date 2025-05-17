import { motion } from 'framer-motion';
import { Star, Trophy, HeartHandshake } from 'lucide-react';

export default function VentajasComponent() {
  return (
    <section className="w-full py-14 px-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12">
        <h2 className="text-5xl font-blowbrush mt-8 font-extrabold text-sky-950 uppercase tracking-widest">
          Ventajas
        </h2>
      </motion.div>

      {/* Texto descriptivo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-600 text-standard max-w-3xl mx-auto text-center space-y-5 leading-relaxed">
        <p>
          En Bigfoot te ofrecemos mucho más que alquiler y clases. Te damos acceso a una forma única de entender la nieve: con actitud, profesionalidad y una experiencia que conecta contigo desde el primer clic hasta el último descenso.
        </p>
        <p>
          Nuestras ventajas están pensadas para quienes buscan lo auténtico, lo funcional y lo emocionante. Aquí no vienes solo a deslizarte, vienes a formar parte de una comunidad que vive la montaña con intensidad, libertad y respeto.
        </p>
      </motion.div>

      {/* Bloques de ventajas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-14 grid grid-cols-1 md:grid-cols-3 text-center gap-10">
        
        <div className="flex flex-col items-center gap-3">
          <Star className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-500 font-semibold tracking-wider">Material de calidad</span>
          <p className=" text-gray-500 max-w-xs">
            Todo nuestro equipo está seleccionado para ofrecer el máximo rendimiento, comodidad y seguridad, sin importar tu nivel.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Trophy className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-500 font-semibold tracking-wider">Instructores top</span>
          <p className=" text-gray-500 max-w-xs">
            Contamos con profesionales que aman enseñar y transmitir su pasión por la nieve, adaptándose a ti paso a paso.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <HeartHandshake className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-500 font-semibold tracking-wider">Atención cercana</span>
          <p className=" text-gray-500 max-w-xs">
            Somos de aquí, hablamos tu idioma y nos importas. Cada detalle está pensado para que te sientas como en casa.
          </p>
        </div>

      </motion.div>
    </section>
  );
}
