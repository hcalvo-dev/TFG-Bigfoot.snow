import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
  producto: Producto;
  dias: number;
};

export default function ProductoCard({ producto, dias }: Props) {
  const [mostrarGuia, setMostrarGuia] = useState(false);

  const categoria = producto.categorias[0]?.nombre.toLowerCase();
  const mostrarGuiaTallas = categoria.includes('bota');
  const esCasco = categoria.includes('casco');
  const esEsqui = categoria.includes('esquí');
  const esForfait = categoria.includes('forfait');

  const stockLabel = producto.estado.toLowerCase() === 'activo' ? 'En stock' : 'Sin stock';
  const total = producto.precioDia * dias;

  return (
    <div className="bg-gray-900 shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
      <div
        className="relative w-full aspect-[4/3] mb-4 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: esEsqui ? '#FFFFFF' : '#F1F1F1' }}>
        <img
          src={producto.imagenUrl}
          alt={producto.nombre}
          className={`w-full h-full ${!esForfait ? 'object-contain' : ''}`}
        />
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg text-white font-semibold truncate hover:text-blue-400">
          {producto.nombre}
        </h2>
        <span
          className={`text-xs px-2 py-0.5 rounded font-bold ${
            producto.estado.toLowerCase() === 'activo' ? 'bg-green-600' : 'bg-red-500'
          } text-white`}>
          {stockLabel}
        </span>
      </div>

      <div className="text-sm text-gray-400 mb-1">{producto.tienda?.nombre}</div>

      <div className="text-white mb-3">
        <span className="text-xl font-semibold">€{total.toFixed(2)}</span>
        <span className="text-sm text-gray-400 ml-2">(€{producto.precioDia.toFixed(2)} / día)</span>
      </div>

      {!esCasco && (
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

      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-medium transition w-full">
        Añadir al carrito
      </button>

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
