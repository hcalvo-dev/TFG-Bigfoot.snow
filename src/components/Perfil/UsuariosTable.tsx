import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import FormularioEdicionUsuario from './FormEditUser';
import Pagination from '../Pagination/Pagination';
import { PUBLIC_API_URL } from '../config';

type Usuario = { id: number; nombre: string; email: string; rol: string };

type UsuarioConRol = {
  id: number;
  nombre: string;
  email: string;
  estadoCuenta: boolean;
  rol: { nombre: string };
};

type Props = {
  usuario: Usuario;
  csrfToken: string;
  onUpdateSuccess: () => void;
};

export default function UsuariosTable({ usuario, csrfToken, onUpdateSuccess }: Props) {
  const [usuarios, setUsuarios] = useState<UsuarioConRol[]>([]);
  const [editando, setEditando] = useState<UsuarioConRol | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [success, setSuccess] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 4;

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(PUBLIC_API_URL + '/api/user/all', {
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken },
      });
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios', err);
    }
  };

  useEffect(() => {
    if (csrfToken) fetchUsuarios();
  }, [csrfToken]);

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(PUBLIC_API_URL + '/api/user/delete', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchUsuarios();
    } catch (err) {
      const error = err as Error;
      Swal.fire('Error al eliminar', error.message, 'error');
    }
  };

  const handleActivate = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Activar usuario?',
      text: '¿Quieres activar esta cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/user/activate`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });
      if (!res.ok) throw new Error();
      fetchUsuarios();
    } catch {
      Swal.fire('Error', 'No se pudo activar el usuario', 'error');
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.rol.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / filasPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  return (
    <div className="relative">
      <div className="rounded-xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
            Gestión de usuarios
          </h2>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="p-2 rounded-md border border-gray-300 text-black placeholder-gray-400 w-full max-w-xs"
          />
        </div>
        <div className="rounded-xl overflow-x-auto shadow">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((u) => (
                <tr
                  key={u.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="py-2 px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {u.id}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {u.nombre}
                  </td>
                  <td className="py-2 px-4 text-white/90">{u.email}</td>
                  <td className="py-2 px-4 text-white/90">{u.rol.nombre}</td>
                  <td className="py-2 px-4 text-white/90">
                    <span
                      className={`inline-block px-5 py-2 text-xs rounded-full ${
                        u.estadoCuenta ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                      {u.estadoCuenta ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-2 px-4 space-x-2 flex items-center">
                    {u.estadoCuenta ? (
                      <>
                        <button
                          onClick={() => setEditando(u)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded font-medium text-gray-900 whitespace-nowrap dark:text-white shadow shadow-black/40">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-medium text-gray-900 whitespace-nowrap dark:text-white shadow shadow-black/40">
                          Eliminar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleActivate(u.id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-medium text-white shadow shadow-black/40">
                        Activar
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

        {editando && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setEditando(null)}>
            <div
              className="bg-white text-black p-6 rounded-2xl max-w-3xl w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setEditando(null)}
                className="absolute z-50 top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">
                ✕
              </button>
              <FormularioEdicionUsuario
                usuario={{ ...editando, rol: editando.rol.nombre }}
                csrfToken={csrfToken}
                onUpdateSuccess={() => {
                  setEditando(null);
                  fetchUsuarios();
                  if (editando?.id === usuario.id) {
                    onUpdateSuccess?.();
                  }
                }}
                permitirEditarRol
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
