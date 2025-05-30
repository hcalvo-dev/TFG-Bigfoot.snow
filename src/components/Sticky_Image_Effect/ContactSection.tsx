import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section className="w-full flex justify-center py-16 px-4">
      <div className="relative w-[85%] h-[400px] rounded-3xl overflow-hidden shadow-xl">
        {/* Imagen de fondo */}
        <img
          src="/img/index/contact.webp"
          alt="Imagen de contacto"
          className="w-full h-full object-cover"
        />

        {/* Texto encima */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="bg-gray-400/30 rounded-xl px-6 py-10 text-center tracking-widest font-extrabold">
            <h2 className="text-4xl font-blowbrush uppercase mb-4 text-sky-950">¿Tienes dudas?</h2>
            <p
              className="text-lg font-semibold text-white mb-6 max-w-xl"
              style={{ textShadow: '0 4px 10px rgba(0,0,0,0.9)' }}>
              Déjanos tu mensaje y marca el primer paso. Porque no hay camino sin huellas… ni respuestas sin preguntas.
            </p>

            <motion.a
              href="/contacto"
              aria-label='Redirigir a la página de contacto'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition">
              Escríbenos  
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
