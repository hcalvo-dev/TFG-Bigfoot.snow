import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { PUBLIC_API_URL } from '../config';

const tallaGuiaUrl = '/img/productos/guia-tallas.webp';

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precioDia: number;
  estado: string;
  imagenUrl: string;
  stockTotal: number;
  categorias: { id: number; nombre: string }[];
  tienda: { id: number; nombre: string };
  tallas?: string[];
  medidas?: string[];
};

type Props = {
  csrfToken: string;
  producto: Producto;
  dias: number;
  fechaInicio: string;
  fechaFin: string;
  onReservado: () => void;
};

export default function ProductoCard({
  csrfToken,
  producto,
  dias,
  fechaInicio,
  fechaFin,
  onReservado,
}: Props) {
  const [mostrarGuia, setMostrarGuia] = useState(false);
  const [successAñadir, setSuccessAñadir] = useState(false);

  const categoria = producto.categorias[0]?.nombre.toLowerCase();
  const mostrarGuiaTallas = categoria.includes('bota');
  const esCasco = categoria.includes('casco');
  const esEsqui = categoria.includes('esquí');
  const esForfait = categoria.includes('forfait');

  const stockLabel = producto.estado.toLowerCase() === 'activo' ? 'En stock' : 'Sin stock';
  const total = producto.precioDia * dias;

  const añadirAlCarrito = async () => {
    try {
      const res = await fetch(PUBLIC_API_URL + '/api/carrito/reservaProducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          productoId: producto.id,
          fechaInicio,
          fechaFin,
          dias,
          total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessAñadir(true);
        setTimeout(() => {
          setSuccessAñadir(false);
        }, 2000);
      } else {
        alert('No se pudo añadir al carrito');
      }

      onReservado();
    } catch (err) {
      console.error('Error al reservar producto:', err);
    }
  };

  const handleCarrito = async () => {
    await añadirAlCarrito();
  };

  return (
    <div className="bg-gray-900 shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
      <div
        className="relative w-full aspect-[4/3] mb-4 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: esEsqui ? '#FFFFFF' : '#F1F1F1' }}>
        <img
          src={producto.imagenUrl}
          alt={`Producto - ${producto.nombre}`}
          className={`w-full h-full ${!esForfait ? 'object-contain' : ''}`}
        />
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg text-white font-semibold truncate hover:text-blue-400">
          {producto.nombre}
        </h2>
        <span
          className={`text-xs px-2 py-0.5 rounded font-bold ${
            producto.estado.toLowerCase() === 'activo' ? 'bg-green-700' : 'bg-red-700'
          } text-white`}>
          {stockLabel}
        </span>
      </div>

      <div className="text-sm text-gray-400 mb-1">{producto.tienda?.nombre}</div>

      <div className="text-white mb-3">
        <span className="text-xl font-semibold">€{total.toFixed(2)}</span>
        <span className="text-sm text-gray-400 ml-2">(€{producto.precioDia.toFixed(2)} / día)</span>
      </div>

      {!esCasco && !esForfait && (
        <div className="text-sm text-gray-300 mb-3">
          {categoria.includes('snowboard') || categoria.includes('esquí') ? (
            <>
              <span className="font-medium text-white">Medidas:</span>{' '}
              {producto.medidas?.join(', ') || 'N/A'}
            </>
          ) : (
            <>
              <span className="font-medium text-white">Tallas:</span>{' '}
              {producto.tallas?.join(', ') || 'N/A'}
              {mostrarGuiaTallas && (
                <button
                  onClick={() => setMostrarGuia(true)}
                  className="ml-4 text-sm text-blue-400 underline hover:text-blue-300">
                  Guía de tallas
                </button>
              )}
            </>
          )}
        </div>
      )}
      <div className="w-full flex justify-center">
        <motion.button
          type="button"
          onClick={handleCarrito}
          disabled={successAñadir}
          className={`transition-all duration-300 ease-in-out
    ${
      successAñadir
        ? 'w-14 h-14 rounded-full bg-blue-500'
        : 'w-full bg-blue-600 px-6 py-2 rounded-lg'
    }
    text-white font-semibold shadow flex justify-center items-center`}
          whileTap={{ scale: 0.95 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={successAñadir ? 'icon' : 'text'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center items-center">
              {successAñadir ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="flex justify-center items-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                'Añadir al carrito'
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mostrarGuia && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMostrarGuia(false)}>
            <motion.div
              className="bg-white p-6 rounded-xl max-w-lg w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}>
              <img
                src={tallaGuiaUrl}
                alt="Guía de tallas"
                className="w-full h-auto rounded-lg mb-4"
              />
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold block mx-auto"
                onClick={() => setMostrarGuia(false)}>
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
