'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mountain } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const tallaGuiaUrl = '/img/productos/guia-tallas.webp';

type Reserva = {
  id: number;
  tipo: 'producto' | 'clase';
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
  total: number;
  imagen?: string;
  montana?: string;
  estado?: string;
  cantidad?: number;
  talla?: string[];
  categoria?: string;
  medidas?: string[];
};

export default function ReservaCard({
  reserva,
  actualizarReservas,
  csrfToken,
}: {
  reserva: Reserva;
  actualizarReservas: () => void;
  csrfToken: string;
}) {
  const [mostrarGuia, setMostrarGuia] = useState(false);

  const fechaInicio = new Date(reserva.fechaInicio);
  const fechaFin = new Date(reserva.fechaFin);
  const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  const categoria = reserva.categoria?.toLowerCase() || '';
  const isBotas = categoria.includes('botas');
  const esEsqui = reserva.tipo === 'producto' && categoria.includes('esquí');
  const esSnowboard = reserva.tipo === 'producto' && categoria.includes('snowboard');
  const esForfait = reserva.tipo === 'producto' && categoria.includes('forfait');
  const esClase = reserva.tipo === 'clase';

  const imagenUrl = esClase ? '/img/clases/imgProducto.webp' : reserva.imagen || '';

  const stockLabel =
    reserva.estado?.toLowerCase() === 'activo' ? (
      <span className="text-green-600 font-semibold text-sm">En stock</span>
    ) : (
      <span className="text-red-600 font-semibold text-sm">Sin stock</span>
    );
  console.log('medida', reserva.medidas);

  const handleDeleteReserva = async (
    id: number,
    csrfToken: string,
    actualizarReservas: () => void
  ) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch('http://localhost:4000/api/carrito/deleteReserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ reservaId: id }),
      });

      if (res.ok) {
        actualizarReservas();
      } else {
        Swal.fire('Error', 'No se pudo eliminar la reserva.', 'error');
      }
    } catch (err) {
      console.error('❌ Error al eliminar reserva:', err);
      Swal.fire('Error', 'Ocurrió un problema al eliminar.', 'error');
    }
  };

  const handleClickDelete = () => {
    handleDeleteReserva(reserva.id, csrfToken, actualizarReservas);
  };

  return (
    <>
      <div className="relative flex flex-col sm:flex-row w-full items-start justify-between gap-4 border border-zinc-200 rounded-xl p-4 shadow-sm bg-white">
        {/* Imagen */}
        <div
          className="w-full sm:w-1/3 max-w-[150px] h-auto aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mx-auto sm:mx-0"
          style={{ backgroundColor: esEsqui ? '#FFFFFF' : '#F1F1F1' }}>
          <img
            src={imagenUrl}
            alt={reserva.titulo}
            className={`w-full h-full ${!esForfait ? 'object-contain' : ''}`}
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-1 justify-between w-full">
          <div className="flex justify-between items-start w-full">
            <h3 className="font-semibold text-18 text-sky-950 truncate">{reserva.titulo}</h3>
            <span className="text-18 font-semibold text-gray-700">{reserva.total.toFixed(2)}€</span>
          </div>

          {!esClase && stockLabel}

          <p className="text-xs text-gray-500">
            {format(fechaInicio, 'dd/MM/yyyy', { locale: es })} -{' '}
            {format(fechaFin, 'dd/MM/yyyy', { locale: es })} · {dias} día{dias > 1 ? 's' : ''}
          </p>

          {reserva.montana && (
            <p className="flex items-center gap-1 text-xs text-gray-600">
              <Mountain className="w-4 h-4 text-sky-950" />
              {reserva.montana}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center border rounded px-2 py-1 text-sm text-gray-700 bg-zinc-100">
              x{reserva.cantidad ?? 1}
            </div>

            {reserva.talla && reserva.talla.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                {reserva.talla.map((t, i) => (
                  <span key={i} className="border rounded px-2 py-1 bg-zinc-100">
                    {t}
                  </span>
                ))}
                {isBotas && (
                  <button
                    onClick={() => setMostrarGuia(true)}
                    className="text-blue-400 underline hover:text-blue-300 text-xs">
                    Guía de tallas
                  </button>
                )}
              </div>
            )}
            {reserva.medidas && reserva.medidas.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                {reserva.medidas.map((t, i) => (
                  <span key={i} className="border rounded px-2 py-1 bg-zinc-100">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <button onClick={handleClickDelete} className="hover:text-rose-600 absolute right-6">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Guía de tallas */}
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
    </>
  );
}
