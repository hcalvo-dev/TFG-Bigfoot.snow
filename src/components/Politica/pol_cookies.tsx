import { motion } from 'framer-motion';
import { Cookie, Eye, Settings2 } from 'lucide-react';

export default function PoliticCookies() {
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
          Política de Cookies
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
          En Bigfoot usamos cookies para que tu experiencia en nuestra web sea más fluida, personalizada y segura. Nuestro objetivo no es invadir tu privacidad, sino ayudarte a encontrar lo que necesitas de forma rápida y con estilo.
        </p>
        <p>
          Puedes aceptar, rechazar o configurar qué cookies deseas permitir. En cualquier momento puedes modificar tu elección desde la configuración de tu navegador.
        </p>
      </motion.div>

      {/* Tipos de cookies */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-14 grid grid-cols-1 md:grid-cols-3 text-center gap-10"
      >
        <div className="flex flex-col items-center gap-3">
          <Cookie className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-700 font-semibold tracking-wider">Cookies esenciales</span>
          <p className=" text-gray-500 max-w-xs">
            Son necesarias para el funcionamiento básico del sitio. Sin ellas, no podrías navegar ni realizar reservas correctamente.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Eye className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-700 font-semibold tracking-wider">Cookies analíticas</span>
          <p className=" text-gray-500 max-w-xs">
            Nos permiten saber qué secciones visitas más, cuánto tiempo pasas en ellas y cómo mejorar la experiencia sin rastrear tu identidad.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Settings2 className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-700 font-semibold tracking-wider">Cookies de preferencia</span>
          <p className=" text-gray-500 max-w-xs">
            Guardan tus elecciones (zona, configuración, etc.) para que la próxima vez tu navegación sea directa y sin fricciones.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
