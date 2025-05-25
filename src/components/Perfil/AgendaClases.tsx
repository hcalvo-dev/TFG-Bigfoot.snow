import { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import { PUBLIC_API_URL } from '../config';

type ClaseAgendada = {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  fechaReserva: string;
  metodoPago: string;
  total: number;
  clase?: {
    titulo: string;
    nivelNombre?: string; // <-- Aquí el nuevo campo que añadimos manualmente en el backend
    montaña?: {
      nombre: string;
    };
  };
  usuario?: {
    nombre: string;
  };
};


type Usuario = { id: number; nombre: string; email: string; rol: string };

type Props = {
  usuario: Usuario;
  csrfToken: string;
};

export default function AgendaClases({ usuario, csrfToken }: Props) {
  const [clases, setClases] = useState<ClaseAgendada[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 4;

  const fetchClases = async () => {
    try {
      const res = await fetch(PUBLIC_API_URL + '/api/clases/clases-agendadas', {
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken },
      });
      const data = await res.json();
      const ordenadas = [...data.datos].sort(
        (a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
      );
      setClases(ordenadas);
    } catch (err) {
      console.error('Error al cargar clases agendadas', err);
    }
  };

  useEffect(() => {
    if (csrfToken) fetchClases();
  }, [csrfToken]);

  const clasesFiltradas = clases.filter((clase) => {
    const tituloClase = clase.clase?.titulo ?? '';
    const nombreAlumno = clase.usuario?.nombre ?? '';
    const nivel = clase.clase?.nivelNombre ?? '';
    return (
      tituloClase.toLowerCase().includes(busqueda.toLowerCase()) ||
      nombreAlumno.toLowerCase().includes(busqueda.toLowerCase()) ||
        nivel.toLowerCase().includes(busqueda.toLowerCase())
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
            Agenda de clases
          </h2>
          <input
            type="text"
            placeholder="Buscar por alumno o título..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="p-2 rounded-md border border-gray-300 text-black placeholder-gray-400 w-full max-w-xs"
          />
        </div>

        <div className="rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Título</th>
                <th className="py-3 px-4">Alumno/a</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Hora</th>
                <th className="py-3 px-4">Montaña</th>
                <th className="py-3 px-4">Nivel</th>
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
                    {clase.usuario?.nombre ?? 'Alumno desconocido'}
                  </td>
                  <td className="py-2 px-4 text-white/90">
                    {new Date(clase.fechaInicio).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-white/90">
                    {new Date(clase.fechaInicio).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2 px-4 text-white/90">{clase.clase?.montaña?.nombre ?? '-'}</td>
                  <td className="py-2 px-4 text-white/90">{clase.clase?.nivelNombre ?? '-'}</td>
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
