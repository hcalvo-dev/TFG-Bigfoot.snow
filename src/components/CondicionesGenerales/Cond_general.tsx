import { motion } from 'framer-motion';
import { ShieldCheck, ScrollText, AlertCircle } from 'lucide-react';

export default function CondicionesGeneralesComponent() {
  return (
    <section className="w-full py-14 px-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-blowbrush mt-8 font-extrabold text-sky-950 uppercase tracking-widest">
          Condiciones Generales
        </h2>
      </motion.div>

      {/* Texto descriptivo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-600 text-standard max-w-3xl mx-auto text-center space-y-5 leading-relaxed"
      >
        <p>
          En Bigfoot queremos que tu experiencia sea transparente, segura y satisfactoria. Por eso, definimos con claridad nuestras condiciones generales de uso, aplicables tanto al alquiler de equipos como a la reserva de clases e interacción en nuestra plataforma.
        </p>
        <p>
          Al utilizar nuestros servicios, aceptas estas condiciones, que han sido diseñadas para proteger tus derechos, garantizar tu seguridad y asegurar una relación justa y profesional.
        </p>
      </motion.div>

      {/* Bloques de condiciones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-14 grid grid-cols-1 md:grid-cols-3 text-center gap-10"
      >
        <div className="flex flex-col items-center gap-3">
          <ScrollText className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-700 font-semibold tracking-wider">Uso del servicio</span>
          <p className=" text-gray-500 max-w-xs">
            El usuario es responsable del equipo alquilado y debe devolverlo en el plazo pactado y en condiciones óptimas. Cualquier daño no contemplado supondrá un coste adicional.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-700 font-semibold tracking-wider">Modificaciones o cancelaciones</span>
          <p className=" text-gray-500 max-w-xs">
            Las reservas pueden modificarse o cancelarse con un mínimo de 24 horas de antelación. Pasado ese plazo, no se garantiza devolución o reprogramación.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <ShieldCheck className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-700 font-semibold tracking-wider">Seguridad y responsabilidad</span>
          <p className=" text-gray-500 max-w-xs">
            Bigfoot no se hace responsable de lesiones o accidentes derivados de un uso incorrecto del equipo. Recomendamos seguir siempre las indicaciones de nuestros instructores.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
