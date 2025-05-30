import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Pagination from '../Pagination/Pagination';
import { error } from 'console';
import { PUBLIC_API_URL } from '../config';

type ClaseActiva = {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  fechaReserva: string;
  estado: string;
  metodoPago: string;
  total: number;
  clase?: {
    titulo: string;
    nivel: string;
    montaña?: {
      nombre: string;
    };
    instructor?: {
      usuario?: {
        nombre: string;
      };
    };
  };
};

type Props = {
  csrfToken: string;
  onUpdateEstadisticas: () => void;
};

export default function ClasesActivasTable({ csrfToken, onUpdateEstadisticas }: Props) {
  const [clases, setClases] = useState<ClaseActiva[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 4;

  const fetchClases = async () => {
    try {
      const res = await fetch(PUBLIC_API_URL + '/api/clases/clases-activas', {
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken },
      });
      const data = await res.json();
      const ordenadas = [...data.datos].sort(
        (a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
      );

      setClases(ordenadas);
    } catch (err) {
      console.error('Error al cargar clases activas', err);
    }
  };

  useEffect(() => {
    if (csrfToken) fetchClases();
  }, [csrfToken]);

  const handleCancelar = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(PUBLIC_API_URL + '/api/clases/cancelar-reserva', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchClases();
      onUpdateEstadisticas();
      Swal.fire('Cancelado', 'La reserva ha sido cancelada', 'success');
    } catch (err) {
      const error = err as Error;
      Swal.fire('Cancelación no permitida', error.message, 'error');
    }
  };

  const clasesFiltradas = clases.filter((clase) => {
    const tituloClase = clase.clase?.titulo ?? '';
    const nombreInstructor = clase.clase?.instructor?.usuario?.nombre ?? '';
    return (
      tituloClase.toLowerCase().includes(busqueda.toLowerCase()) ||
      nombreInstructor.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const totalPaginas = Math.ceil(clasesFiltradas.length / filasPorPagina);
  const clasesPaginadas = clasesFiltradas.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  return (
    <div className="relative">
      <div className="rounded-xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
            Clases activas
          </h2>
          <input
            type="text"
            placeholder="Buscar por especialidad o instructor..."
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
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Titulo</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Montaña</th>
                <th className="py-3 px-4">Nivel</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Hora</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clasesPaginadas.map((clase, i) => (
                <tr
                  key={clase.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                    {(paginaActual - 1) * filasPorPagina + i + 1}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                    {clase.clase?.titulo ?? 'Clase eliminada'}
                  </td>
                  <td className="py-2 px-4 text-white/90">
                    {' '}
                    {clase.clase?.instructor?.usuario?.nombre ?? 'Sin instructor'}
                  </td>
                  <td className="py-2 px-4 text-white/90">
                    {clase.clase?.montaña?.nombre ?? 'Sin montaña'}
                  </td>
                  <td className="py-2 px-4 text-white/90">{clase.clase?.nivel ?? 'Sin nivel'}</td>
                  <td className="py-2 px-4 text-white/90">
                    {new Date(clase.fechaInicio).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-white/90">
                    {new Date(clase.fechaInicio).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(clase.fechaFin).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2 px-4 text-white/90 capitalize">{clase.estado}</td>
                  <td className="py-2 px-4 text-white/90">
                    {new Date(clase.fechaFin) >= new Date() && (
                      <button
                        onClick={() => handleCancelar(clase.id)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-medium text-white shadow shadow-black/40">
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
  );
}
