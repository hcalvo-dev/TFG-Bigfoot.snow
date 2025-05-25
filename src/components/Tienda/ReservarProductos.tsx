import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import FiltrosVerticales from './FiltrosVerticales';
import ProductoCard from './ProductoCard';
import { z } from 'zod';
import { PUBLIC_API_URL } from '../config';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const fechaSchema = z
  .object({
    fechaInicio: z.string().refine(
      (val) => {
        const fecha = new Date(val);
        return fecha >= tomorrow;
      },
      { message: 'La fecha de inicio debe ser al menos mañana' }
    ),
    fechaFin: z.string(),
  })
  .refine((data) => new Date(data.fechaFin) >= new Date(data.fechaInicio), {
    message: 'La fecha de fin no puede ser anterior a la de inicio',
    path: ['fechaFin'],
  });

type Props = {
  session: string;
};

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
};

export default function TiendaComponent({ session }: Props) {
  const parsedSession = JSON.parse(session);
  const [csrfToken, setCsrfToken] = useState('');
  const [tituloSeccion, setTituloSeccion] = useState('Explora nuestro catálogo');
  const [mensajeIntro, setMensajeIntro] = useState(
    'Descubre productos disponibles según tus fechas.'
  );

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [errorFechas, setErrorFechas] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
  const [mostrarAside, setMostrarAside] = useState(false);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [tiendas, setTiendas] = useState<{ id: number; nombre: string }[]>([]);
  const searchParams = new URLSearchParams(window.location.search);
  const categoria = searchParams.get('categoria') ?? '';
  const slug = categoria.toLowerCase().replace(/\s+/g, '-');

  const [opcion, setOpcion] = useState(slug);
  const [filtros, setFiltros] = useState({
    categoria: slug,
    estado: '',
    precio: '',
    tienda: 'Bigfoot-SNevada',
  });

  useEffect(() => {
    switch (slug) {
      case 'esqui':
        setTituloSeccion('Equipo de Skii');
        setMensajeIntro('Equípate con lo mejor para deslizarte por la nieve.');
        break;
      case 'snowboard':
        setTituloSeccion('Snowboard Riders');
        setMensajeIntro('Encuentra lo esencial para tu próxima aventura.');
        break;
      default:
        setTituloSeccion('Explora nuestro catálogo');
        setMensajeIntro('Descubre productos disponibles según tus fechas.');
    }
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(PUBLIC_API_URL + '/api/csrf-token', { credentials: 'include' });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error al obtener token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const refrescarDisponibles = async () => {
    try {
      const res = await fetch(PUBLIC_API_URL + '/api/productos/disponibles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ fechaInicio, fechaFin }),
      });
      const data = await res.json();
      setProductosDisponibles(data);
      setMostrarAside(true);
    } catch (err) {
      console.error('Error al obtener productos disponibles:', err);
    }
  };

  useEffect(() => {
    if (!fechaInicio || !fechaFin) return;
    try {
      const result = fechaSchema.parse({ fechaInicio, fechaFin });
      setErrorFechas('');
      refrescarDisponibles();
    } catch (e: any) {
      setErrorFechas(e.errors?.[0]?.message || 'Error en las fechas');
    }
  }, [fechaInicio, fechaFin, csrfToken]);

  useEffect(() => {
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

        setCategorias(await catRes.json());
        setTiendas(await tiendaRes.json());
      } catch (error) {
        console.error('Error al cargar filtros:', error);
      }
    };
    fetchFiltros();
  }, [csrfToken]);

  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const productosFiltrados = productosDisponibles
    .filter((p) =>
      filtros.categoria
        ? p.categorias.some((c) => normalize(c.nombre) === normalize(filtros.categoria))
        : true
    )
    .filter((p) => (filtros.estado ? normalize(p.estado) === normalize(filtros.estado) : true))
    .filter((p) => {
      if (!filtros.precio) return true;
      const precio = p.precioDia;
      if (filtros.precio === '0-50') return precio <= 50;
      if (filtros.precio === '50-100') return precio > 50 && precio <= 100;
      if (filtros.precio === '100+') return precio > 100;
      return true;
    })
    .filter((p) =>
      filtros.tienda ? normalize(p.tienda?.nombre || '') === normalize(filtros.tienda) : true
    );

  useEffect(() => {
    const normalize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const categoriaExacta = categorias.find((c) => normalize(c.nombre) === normalize(slug));

    if (categoriaExacta) {
      setFiltros((prev) => ({
        ...prev,
        categoria: categoriaExacta.nombre, // valor exacto esperado por el <option>
      }));
    }
  }, [categorias, slug]);

  const dias =
    fechaInicio && fechaFin
      ? Math.max(
          1,
          Math.ceil(
            (new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  return (
    <section className="min-h-[50vh] px-6 py-16">
      <div className="max-w-3xl mt-5 mx-auto text-center mb-12">
        <h1 className="text-5xl font-blowbrush font-extrabold text-sky-950 mb-4 uppercase tracking-wide">
          {tituloSeccion}
        </h1>
        <p className="text-gray-600 text-lg italic leading-relaxed">{mensajeIntro}</p>
        {fechaInicio && fechaFin && errorFechas && (
          <p className="text-red-500 font-semibold mt-2">{errorFechas}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
        <div className="flex items-center gap-2 bg-white border border-blue-400 rounded-xl shadow px-4 py-3">
          <label htmlFor="fechaInicio" className="text-gray-600 font-semibold whitespace-nowrap">
            Inicio:
          </label>
          <input
            id="fechaInicio"
            type="date"
            className="bg-transparent focus:outline-none text-gray-800"
            min={(() => {
              const mañana = new Date();
              mañana.setDate(mañana.getDate() + 1);
              return mañana.toISOString().split('T')[0];
            })()}
            onChange={(e) => {
              setFechaInicio(e.target.value);
              if (fechaFin) {
                setFechaFin('');
                setMostrarAside(false);
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-blue-400 rounded-xl shadow px-4 py-3">
          <label htmlFor="fechaFin" className="text-gray-600 font-semibold whitespace-nowrap">
            Fin:
          </label>
          <input
            id="fechaFin"
            type="date"
            value={fechaFin}
            className="bg-transparent focus:outline-none text-gray-800"
            min={fechaInicio || new Date().toISOString().split('T')[0]}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      {mostrarAside && (
        <div className="flex flex-col md:flex-row gap-6">
          <AnimatePresence mode="wait">
            <motion.aside
              key="aside-filtros"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full md:w-1/4">
              <FiltrosVerticales
                categorias={categorias}
                tiendas={tiendas}
                filtros={filtros}
                total={productosFiltrados.length}
                slug={opcion}
                onFiltroChange={(nuevo) => setFiltros(nuevo)}
              />
            </motion.aside>
          </AnimatePresence>

          <motion.div
            layout
            className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {productosFiltrados.map((producto) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}>
                  <ProductoCard
                    csrfToken={csrfToken}
                    producto={producto}
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    dias={dias + 1}
                    onReservado={refrescarDisponibles}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </section>
  );
}
