'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Pagination from '../Pagination/Pagination';
import { PUBLIC_API_URL } from '../config';
import NotificacionGlobal from '../ui/NotificacionGlobal';
import { toast } from 'react-hot-toast';

type ProductoReserva = {
  id: number;
  talla?: string;
  medidas?: string[];
  producto?: {
    nombre: string;
    tienda?: { nombre: string };
    categorias?: { nombre: string }[];
    tallas?: string[];
    medidas?: string[];
  };
  reserva: {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
  };
};
type Props = {
  csrfToken: string;
  onUpdateEstadisticas: () => void;
};

export default function ProductosReservadosTable({ csrfToken, onUpdateEstadisticas }: Props) {
  const [productos, setProductos] = useState<ProductoReserva[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);
  const filasPorPagina = 4;

  const fetchProductos = async () => {
    try {
      const res = await fetch(PUBLIC_API_URL + '/api/productos/reservados', {
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken },
      });
      const data = await res.json();
      const ordenados = [...(data.productos || [])].sort(
        (a, b) =>
          new Date(a.reserva.fechaInicio).getTime() - new Date(b.reserva.fechaInicio).getTime()
      );

      setProductos(ordenados);
    } catch (err) {
      console.error('Error al cargar productos reservados', err);
    }
  };

  useEffect(() => {
    if (csrfToken) fetchProductos();
  }, [csrfToken]);

  const productosFiltrados = productos.filter((p) => {
    const nombre = p.producto?.nombre || '';
    const tienda = p.producto?.tienda?.nombre || '';
    return (
      nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      tienda.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / filasPorPagina);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  const handleCancelar = async (reservaId: number) => {
    const confirm = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
    });
    if (!confirm.isConfirmed) return;
    setCancelandoId(reservaId);

    try {
      const res = await fetch(PUBLIC_API_URL + '/api/productos/cancelar-reserva', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ reservaId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchProductos();
      onUpdateEstadisticas();
      toast.success('TICKET DE CANCELACIÓN ENVIADO AL CORREO');
      Swal.fire('Cancelado', 'La reserva ha sido cancelada', 'success');
    } catch (err) {
      const error = err as Error;
      Swal.fire('Cancelación no permitida', error.message, 'error');
    } finally {
      setCancelandoId(null);
    }
  };

  return (
    <>
      <NotificacionGlobal />
      <div className="relative">
        <div className="rounded-xl text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
              Productos reservados
            </h2>
            <input
              type="text"
              placeholder="Buscar por producto o tienda..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              className="p-2 rounded-md border border-gray-300 text-black placeholder-gray-400 w-full max-w-xs"
            />
          </div>

          <div className="overflow-auto rounded-xl shadow">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Tallas/Medidas</th>
                  <th className="py-3 px-4">Tienda</th>
                  <th className="py-3 px-4">Fecha Reserva</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosPaginados.map((r, i) => {
                  const categoria = r.producto?.categorias?.[0]?.nombre?.toLowerCase() || '';
                  const esEquipamiento = ['esquí', 'snowboard'].some((tipo) =>
                    categoria.includes(tipo)
                  );
                  const esForfait = categoria.includes('forfait');
                  let infoExtra = '-';

                  if (!esForfait) {
                    if (esEquipamiento && r.producto?.medidas && r.producto.medidas.length > 0) {
                      infoExtra = r.producto.medidas.join(', ');
                    } else if (r.producto?.tallas && r.producto.tallas.length > 0) {
                      infoExtra = r.producto.tallas.join(', ');
                    } else {
                      infoExtra = 'Talla única';
                    }
                  }

                  return (
                    <tr
                      key={r.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                        {(paginaActual - 1) * filasPorPagina + i + 1}
                      </td>
                      <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                        {r.producto?.nombre || 'Producto eliminado'}
                      </td>
                      <td className="py-2 px-4 text-white/90">
                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                      </td>
                      <td className="py-2 px-4 text-white/90">{infoExtra}</td>
                      <td className="py-2 px-4 text-white/90">
                        {r.producto?.tienda?.nombre || 'Sin tienda'}
                      </td>
                      <td className="py-2 px-4 text-white/90">
                        {new Date(r.reserva.fechaInicio).toLocaleDateString()} -{' '}
                        {new Date(r.reserva.fechaFin).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-white/90 capitalize">{r.reserva.estado}</td>
                      <td className="py-2 px-4 text-white/90">
                        {new Date(r.reserva.fechaFin) >= new Date() && (
                          <button
                            onClick={() => handleCancelar(r.reserva.id)}
                            disabled={cancelandoId !== null}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-medium text-white shadow shadow-black/40">
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={setPaginaActual}
          />
        </div>
      </div>
    </>
  );
}
