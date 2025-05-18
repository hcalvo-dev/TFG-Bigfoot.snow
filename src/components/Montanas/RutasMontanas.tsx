import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinned, MountainSnow, TrendingUp, AlertTriangle, Skull } from 'lucide-react';

type Montania = {
  id: number;
  nombre: string;
  ubicacion: string;
  altura: number;
  descripcion?: string;
  imagen: string;
};

type Ruta = {
  id: number;
  nombre: string;
  dificultad: 'fácil' | 'media' | 'difícil';
  longitud: number;
};

export default function RutasMontanas({ montana }: { montana: Montania | null }) {
  const [csrfToken, setCsrfToken] = useState('');
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include',
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error al obtener token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchRutas = async () => {
      if (!montana || !csrfToken) return;
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/rutas/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken, // si lo usas
          },
          credentials: 'include',
          body: JSON.stringify({
            nombre: montana.nombre, // 🔴 ESTE campo es requerido
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`Error ${res.status}:`, text);
          throw new Error('Respuesta no válida del servidor');
        }

        const data = await res.json();
        setRutas(data);
      } catch (error) {
        console.error('Error al obtener rutas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutas();
  }, [csrfToken, montana]);

  if (!montana) {
    return (
      <p className="text-center text-gray-500 py-10">Selecciona una montaña para ver sus rutas.</p>
    );
  }

  const getColorClass = (dificultad: string) => {
    if (dificultad === 'fácil') return 'border-green-500 bg-green-50';
    if (dificultad === 'media') return 'border-blue-500 bg-blue-50';
    if (dificultad === 'difícil') return 'border-red-600 bg-red-50';
    if (dificultad === 'experto') return 'border-zinc-900 bg-zinc-200';
    return 'border-gray-300 bg-gray-50';
  };

  const getIcon = (dificultad: string) => {
    if (dificultad === 'fácil') return <MountainSnow className="w-7 h-7 text-green-600" />;
    if (dificultad === 'media') return <TrendingUp className="w-7 h-7 text-blue-600" />;
    if (dificultad === 'difícil') return <AlertTriangle className="w-7 h-7 text-red-600" />;
    if (dificultad === 'experto') return <Skull className="w-7 h-7 text-zinc-900" />;
    return <MapPinned className="w-7 h-7 text-gray-600" />;
  };

  return (
    <section className="w-full min-h-[75vh] px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h3 className="text-5xl font-blowbrush font-extrabold uppercase text-sky-950 tracking-widest mb-2">
            {montana.nombre}
          </h3>
          <p className="text-gray-600 text-lg font-medium">Explora las rutas de montaña</p>
        </div>

        {loading ? (
          ''
        ) : rutas.length === 0 ? (
          <p className="text-center text-gray-500">No hay rutas registradas para esta montaña.</p>
        ) : (
          <AnimatePresence mode="wait">
            {!loading && rutas.length > 0 && (
              <motion.div
                key={montana.nombre}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="grid gap-6 md:grid-cols-3">
                {rutas.map((ruta) => (
                  <motion.div
                    key={ruta.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border-l-8 ${getColorClass(
                      ruta.dificultad
                    )}`}>
                    <div className="mt-1">{getIcon(ruta.dificultad)}</div>

                    <div>
                      <h4 className="text-xl font-bold text-sky-900">{ruta.nombre}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Dificultad:{' '}
                        <span className="capitalize font-semibold">{ruta.dificultad}</span> ·{' '}
                        {ruta.longitud} km
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
