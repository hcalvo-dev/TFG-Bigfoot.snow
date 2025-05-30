import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Pagination from '../Pagination/Pagination';
import { Filter, Plus, Tag, ToggleLeft, Euro, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FormularioProducto from './FormularioProducto';
import { PUBLIC_API_URL } from '../config';

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
  views?: number;
};

type Categoria = { id: number; nombre: string };
type Tienda = { id: number; nombre: string };

type Props = {
  csrfToken: string;
};

export default function ProductosTable({ csrfToken }: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [modalProducto, setModalProducto] = useState<Producto | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroTienda, setFiltroTienda] = useState('');

  const filasPorPagina = 5;

  const fetchProductos = async () => {
    const res = await fetch(PUBLIC_API_URL + '/api/productos/all', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    });
    const data = await res.json();
    setProductos(data);
  };

  const fetchFiltros = async () => {
    try {
      const [catRes, tiendaRes] = await Promise.all([
        fetch(PUBLIC_API_URL + '/api/categorias/all', {
          headers: { 'CSRF-Token': csrfToken },
          credentials: 'include',
        }),
        fetch(PUBLIC_API_URL + '/api/tiendas/all', {
          headers: { 'CSRF-Token': csrfToken },
          credentials: 'include',
        }),
      ]);

      if (!catRes.ok || !tiendaRes.ok) {
        const errorText = await catRes.text();
        console.error('Error en la carga de filtros:', errorText);
        return;
      }

      const categoriasData = await catRes.json();
      const tiendasData = await tiendaRes.json();

      if (!Array.isArray(categoriasData) || !Array.isArray(tiendasData)) {
        console.error('Los datos recibidos no son arrays:', { categoriasData, tiendasData });
        return;
      }

      setCategorias(categoriasData);
      setTiendas(tiendasData);
    } catch (error) {
      console.error('Error al obtener filtros:', error);
    }
  };

  useEffect(() => {
    if (csrfToken) {
      fetchProductos();
      fetchFiltros();
    }
  }, [csrfToken]);

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    });
    if (!confirm.isConfirmed) return;

    const res = await fetch(PUBLIC_API_URL + '/api/productos/delete', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    if (res.ok) fetchProductos();
    else Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
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
      const res = await fetch(`${PUBLIC_API_URL}/api/productos/activate`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });
      if (!res.ok) throw new Error();
      fetchProductos();
    } catch {
      Swal.fire('Error', 'No se pudo activar el usuario', 'error');
    }
  };

  const productosFiltrados = productos
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((p) =>
      filtroCategoria ? p.categorias.some((cat) => cat.nombre === filtroCategoria) : true
    )
    .filter((p) => (filtroEstado ? p.estado === filtroEstado : true))
    .filter((p) => {
      if (!filtroPrecio) return true;
      if (filtroPrecio === '0-50') return p.precioDia >= 0 && p.precioDia <= 50;
      if (filtroPrecio === '50-100') return p.precioDia >= 50 && p.precioDia <= 100;
      if (filtroPrecio === '100+') return p.precioDia > 100;
      return true;
    })
    .filter((p) => (filtroTienda ? p.tienda?.nombre === filtroTienda : true));

  const totalPaginas = Math.ceil(productosFiltrados.length / filasPorPagina);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  return (
    <>
      <div className="relative space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
            Gestión de Productos
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              className="p-2 rounded-md border border-gray-300 text-black placeholder-gray-600 w-full sm:max-w-xs"
            />

            <button
              onClick={() => {
                setMostrarFiltros(!mostrarFiltros);
                if (mostrarFiltros) {
                  setFiltroCategoria('');
                  setFiltroEstado('');
                  setFiltroPrecio('');
                  setFiltroTienda('');
                }
              }}
              className="flex items-center gap-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition">
              <Filter size={18} />
              Filtro
            </button>

            <button
              onClick={() => setModalProducto({} as Producto)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow shadow-black/40 transition">
              <Plus size={18} />
              Añadir
            </button>
          </div>
        </div>

        {/* Panel de Filtros */}
        <AnimatePresence>
          {mostrarFiltros && (
            <motion.div
              key="filtros"
              initial={{ opacity: 0, scaleY: 0.95 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="origin-top transition-transform bg-white border border-gray-300 rounded-2xl shadow-xl p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Filtro Categoría */}
                <div className="relative flex items-center">
                  <Tag className="absolute left-2 w-4 h-4 text-gray-500" />
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className={`pl-8 pr-2 py-2 border rounded-md text-sm w-full ${
                      filtroCategoria ? 'text-sky-950' : 'text-gray-600'
                    }`}>
                    <option value="" disabled hidden>
                      Categoría
                    </option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro Estado */}
                <div className="relative flex items-center">
                  <ToggleLeft className="absolute left-2 w-4 h-4 text-gray-500" />
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className={`pl-8 pr-2 py-2 border rounded-md text-sm w-full ${
                      filtroEstado ? 'text-sky-950' : 'text-gray-600'
                    }`}>
                    <option value="" disabled hidden>
                      Estado
                    </option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Filtro Precio */}
                <div className="relative flex items-center">
                  <Euro className="absolute left-2 w-4 h-4 text-gray-500" />
                  <select
                    value={filtroPrecio}
                    onChange={(e) => setFiltroPrecio(e.target.value)}
                    className={`pl-8 pr-2 py-2 border rounded-md text-sm w-full ${
                      filtroPrecio ? 'text-sky-950' : 'text-gray-600'
                    }`}>
                    <option value="" disabled hidden>
                      Precio
                    </option>
                    <option value="0-50">€0 - €50</option>
                    <option value="50-100">€50 - €100</option>
                    <option value="100+">€100+</option>
                  </select>
                </div>

                {/* Filtro Tienda */}
                <div className="relative flex items-center">
                  <Store className="absolute left-2 w-4 h-4 text-gray-500" />
                  <select
                    value={filtroTienda}
                    onChange={(e) => setFiltroTienda(e.target.value)}
                    className={`pl-8 pr-2 py-2 border rounded-md text-sm w-full ${
                      filtroTienda ? 'text-sky-950' : 'text-gray-600'
                    }`}>
                    <option value="" disabled hidden>
                      Tienda
                    </option>
                    {tiendas.map((t) => (
                      <option key={t.id} value={t.nombre}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabla */}
        <div className="overflow-auto rounded-xl shadow">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="p-3 w-max">Nombre</th>
                <th className="p-3">Precio/Día</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Tienda</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosPaginados.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="p-3 min-w-[200px] max-w-[250px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={PUBLIC_API_URL + p.imagenUrl}
                        alt={`Producto - ${p.nombre}`}
                        className="w-12 h-12 object-cover rounded-md border border-gray-300 shrink-0"
                      />
                      <span className="font-medium text-gray-900 dark:text-white break-words line-clamp-2">
                        {p.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-white/90">€{p.precioDia.toFixed(2)}</td>
                  <td className="p-3 text-white/90">{p.stockTotal}</td>
                  <td className="p-3 text-white/90">
                    {p.categorias.map((c) => c.nombre).join(', ')}
                  </td>
                  <td className="p-3 text-white/90">{p.tienda.nombre}</td>
                  <td className="p-3 text-white/90">
                    <span
                      className={`inline-block px-5 py-2 text-xs rounded-full ${
                        p.estado === 'activo'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="p-3 space-x-2 flex items-center">
                    {p.estado === 'activo' ? (
                      <>
                        <button
                          onClick={() => setModalProducto(p)}
                          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded font-medium text-gray-900 whitespace-nowrap dark:text-white shadow shadow-black/40">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-medium text-gray-900 whitespace-nowrap dark:text-white shadow shadow-black/40">
                          Eliminar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleActivate(p.id)}
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
      </div>
      {/* Modal */}
      {modalProducto && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setModalProducto(null)}>
          <div
            className="bg-white text-black p-6 rounded-2xl max-w-3xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalProducto(null)}
              className="absolute z-50 top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">
              ✕
            </button>

            <FormularioProducto
              producto={
                modalProducto.id
                  ? {
                      ...modalProducto,
                      categoria: modalProducto.categorias[0],
                    }
                  : undefined
              }
              categorias={categorias}
              tiendas={tiendas}
              csrfToken={csrfToken}
              onSuccess={() => {
                fetchProductos();
                setTimeout(() => {
                  setModalProducto(null);
                }, 2000);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
