import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowDownCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import FormularioNivel from './FormularioNivel';
import FormularioDescuento from './FormularioDescuento';
import Pagination from '../Pagination/Pagination';
import { AplicaEn } from '@prisma/client';
import { a } from 'node_modules/framer-motion/dist/types.d-B50aGbjN';
import { PUBLIC_API_URL } from '../config';

type Nivel = { id: number; nombre: string; precio: number };
type Descuento = {
  id: number;
  codigo: string;
  descripcion: string;
  porcentaje: number;
  aplicaEn: AplicaEn;
  fechaValidez: string;
  activo: boolean;
};

type Props = { csrfToken: string };

export default function Tarifas({ csrfToken }: Props) {
  const [vista, setVista] = useState<'niveles' | 'descuentos' | null>(null);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [modalNivel, setModalNivel] = useState<Nivel | null>(null);
  const [modalDescuento, setModalDescuento] = useState<Descuento | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 6;

  const fetchDescuentos = async () => {
    const res = await fetch(PUBLIC_API_URL + '/api/descuentos/allDescuentos', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setDescuentos(data);
    } else {
      console.error('❌ La respuesta no es un array:', data);
      setDescuentos([]);
    }
  };

  const fetchNiveles = async () => {
    const res = await fetch(PUBLIC_API_URL + '/api/nivel/all', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    });
    const data = await res.json();
    setNiveles(data);
  };

  useEffect(() => {
    if (!csrfToken) return;
    const fetchData = async () => {
      if (vista === 'niveles') {
        await fetchNiveles();
      } else if (vista === 'descuentos') {
        await fetchDescuentos();
      }
    };
    fetchData();
  }, [vista, csrfToken]);

  const nivelesPaginados = niveles.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );
  const descuentosPaginados = descuentos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar descuento?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    });
    if (!confirm.isConfirmed) return;

    const res = await fetch(PUBLIC_API_URL + '/api/descuentos/delete', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    if (res.ok) await fetchDescuentos();
    else Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
  };

  const handleActivate = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Activar descuento?',
      text: '¿Quieres activar este descuento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/descuentos/activate`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });
      if (!res.ok) throw new Error();
      await fetchDescuentos();
    } catch {
      Swal.fire('Error', 'No se pudo activar el usuario', 'error');
    }
  };

  const normalizeAplicaEn = (valor: string): AplicaEn => {
    switch (valor.toUpperCase()) {
      case 'PRODUCTOS':
        return 'PRODUCTOS';
      case 'CLASES':
        return 'CLASES';
      case 'AMBOS':
        return 'AMBOS';
      default:
        return 'PRODUCTOS'; // fallback por defecto
    }
  };

  return (
    <>
      <div className="relative space-y-6 ">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
            Gestión de Tarifas
          </h2>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Botones de vista */}
          <div className="flex gap-2">
            <button
              onClick={() => setVista('niveles')}
              className={`px-4 py-2 rounded-md font-bold ${
                vista === 'niveles'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
              Precios por Nivel
            </button>
            <button
              onClick={() => setVista('descuentos')}
              className={`px-4 py-2 rounded-md font-bold ${
                vista === 'descuentos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
              Descuentos
            </button>
          </div>

          {/* Botón de añadir descuento */}
          {vista === 'descuentos' && (
            <button
              onClick={() => setModalDescuento({} as Descuento)}
              className="flex items-center gap-2 bg-sky-800 hover:bg-sky-950 text-white px-4 py-2 rounded-md shadow">
              <Plus size={18} />
              Nuevo Descuento
            </button>
          )}
        </div>

        {vista === 'niveles' && (
          <>
            <motion.div
              key="tabla-niveles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="overflow-auto rounded-xl shadow">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Precio (€)</th>
                    <th className="p-3">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {nivelesPaginados.map((nivel) => (
                    <tr
                      key={nivel.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="p-3 text-white/90">{nivel.nombre}</td>
                      <td className="p-3 text-white/90">€{nivel.precio}</td>
                      <td className="p-3 text-white/90">
                        <button
                          onClick={() => setModalNivel(nivel)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded font-medium text-gray-900 whitespace-nowrap dark:text-white shadow shadow-black/40">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
            <Pagination
              currentPage={paginaActual}
              totalPages={Math.ceil(niveles.length / filasPorPagina)}
              onPageChange={setPaginaActual}
            />
          </>
        )}

        {vista === 'descuentos' && (
          <>
            <motion.div
              key="tabla-descuentos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="overflow-auto rounded-xl shadow">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-3">Código</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3">%</th>
                    <th className="p-3">Aplica en</th>
                    <th className="p-3">Validez</th>
                    <th className="p-3">Activo</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {descuentosPaginados.map((d) => (
                    <tr
                      key={d.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="p-3 text-white/90">{d.codigo}</td>
                      <td className="p-3 text-white/90">{d.descripcion}</td>
                      <td className="p-3 text-white/90">{d.porcentaje}%</td>
                      <td className="p-3 text-white/90">
                        {d.aplicaEn === 'PRODUCTOS'
                          ? 'Productos'
                          : d.aplicaEn === 'CLASES'
                          ? 'Clases'
                          : 'Ambos'}
                      </td>
                      <td className="p-3 text-white/90">
                        {new Date(d.fechaValidez).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-white/90">
                        <span
                          className={`inline-block px-5 py-2 text-xs rounded-full ${
                            d.activo ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                          }`}>
                          {d.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-3 space-x-2 flex items-center">
                        {d.activo ? (
                          <>
                            <button
                              onClick={() =>
                                setModalDescuento({
                                  ...d,
                                  aplicaEn: normalizeAplicaEn(d.aplicaEn),
                                })
                              }
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded font-medium text-gray-900 whitespace-nowrap dark:text-white shadow shadow-black/40">
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-medium text-gray-900 whitespace-nowrap dark:text-white shadow shadow-black/40">
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleActivate(d.id)}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-medium text-white shadow shadow-black/40">
                            Activar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
            <Pagination
              currentPage={paginaActual}
              totalPages={Math.ceil(descuentos.length / filasPorPagina)}
              onPageChange={setPaginaActual}
            />
          </>
        )}
      </div>

      {/* Modales */}
      {modalNivel && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setModalNivel(null)}>
          <div
            className="relative bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalNivel(null)}
              className="absolute top-3 right-4 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">
              ✕
            </button>
            <FormularioNivel
              nivel={modalNivel}
              csrfToken={csrfToken}
              onSuccess={async () => {
                setModalNivel(null);
                await fetchNiveles();
              }}
            />
          </div>
        </div>
      )}

      {modalDescuento && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setModalDescuento(null)}>
          <div
            className="relative bg-white p-6 rounded-xl shadow-xl max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalDescuento(null)}
              className="absolute top-3 right-4 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">
              ✕
            </button>
            <FormularioDescuento
              descuento={modalDescuento}
              csrfToken={csrfToken}
              onSuccess={async () => {
                setModalDescuento(null);
                await fetchDescuentos();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
