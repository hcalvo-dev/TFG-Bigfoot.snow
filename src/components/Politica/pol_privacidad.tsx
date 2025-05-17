import { motion } from 'framer-motion';
import { LockKeyhole, FileCheck2, GraduationCap } from 'lucide-react';

export default function PoliticPrivacidad() {
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
          Política de Privacidad
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
          En Bigfoot nos tomamos tu privacidad muy en serio. Queremos que sepas cómo tratamos tus datos, por qué los recopilamos y cómo los protegemos. Este sitio ha sido desarrollado como parte de un <strong>Trabajo de Fin de Grado del Ciclo Superior de Desarrollo de Aplicaciones Web</strong>, con especial atención a la ética digital y el cumplimiento normativo.
        </p>
        <p>
          La recopilación de información se limita a lo esencial para ofrecerte una experiencia personalizada, segura y eficaz. No compartimos tus datos con terceros y siempre puedes ejercer tus derechos de acceso, rectificación o eliminación.
        </p>
      </motion.div>

      {/* Bloques de información */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-14 grid grid-cols-1 md:grid-cols-3 text-center gap-10"
      >
        <div className="flex flex-col items-center gap-3">
          <LockKeyhole className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-500 font-semibold tracking-wider">Protección de datos</span>
          <p className=" text-gray-500 max-w-xs">
            Tus datos están protegidos con medidas técnicas y organizativas de seguridad, cumpliendo con el RGPD y otras normativas aplicables.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <FileCheck2 className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-500 font-semibold tracking-wider">Uso responsable</span>
          <p className=" text-gray-500 max-w-xs">
            Solo utilizamos la información con fines estrictamente necesarios: gestión de reservas, contacto y mejora del servicio.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <GraduationCap className="w-12 h-12 text-blue-700" />
          <span className="text-18 uppercase text-gray-500 font-semibold tracking-wider">Proyecto académico</span>
          <p className=" text-gray-500 max-w-xs">
            Esta web forma parte de un TFG para demostrar competencias profesionales en desarrollo web, diseño, accesibilidad y protección de datos.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
