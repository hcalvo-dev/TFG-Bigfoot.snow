import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, School, ShoppingBag, LogOut, ClipboardList, UserRoundSearch } from 'lucide-react';
import FormularioEdicionUsuario from './FormEditUser';
import UsuariosTable from './UsuariosTable';
import AltaInstructorForm from './AltaInstructor';
import ClasesTable from './ClasesTable';

// Definimos el tipo de las props y del usuario
type Props = {
  session: string;
};

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

export default function PerfilContent({ session }: Props) {
  const parsedSession = JSON.parse(session) as {
    isLogged: boolean;
    userId?: string;
    email?: string;
    rol?: string;
  };

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [reservasActivas, setReservasActivas] = useState({ total: 0, datos: [] });
  const [clasesProximas, setClasesProximas] = useState({ total: 0, datos: [] });
  const [productosReservados, setProductosReservados] = useState({ total: 0, datos: [] });
  const [reloadUser, setReloadUser] = useState(false);
  const [view, setView] = useState<'perfil' | 'clases' | 'productos' | 'instructor' | 'usuarios'>(
    'perfil'
  );
  const [csrfToken, setCsrfToken] = useState('');

  // Obtenemos el token CSRF al cargar el componente
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include',
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error al obtener token CSRF:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Obtenemos el usuario al cargar el componente
  const fetchUsuario = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/user/me', {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
      });
      const data = await res.json();
      setUsuario(data);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  // Obtenemos las estadísticas al cargar el componente
  const fetchEstadisticas = async () => {
    try {
      const endpoints = [
        { url: '/api/estadisticas/reservas-activas', setter: setReservasActivas },
        { url: '/api/estadisticas/clases-proximas', setter: setClasesProximas },
        { url: '/api/estadisticas/productos-reservados', setter: setProductosReservados },
      ];

      for (const { url, setter } of endpoints) {
        const res = await fetch(`http://localhost:4000${url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
        });
        const data = await res.json();
        setter(data);
      }
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  };

  // Actualizamos el usuario y las estadísticas al cargar el componente
  useEffect(() => {
    if (csrfToken) fetchUsuario();
  }, [csrfToken, reloadUser]);

  // Actualizamos las estadísticas al cargar el componente
  useEffect(() => {
    if (usuario && csrfToken) {
      fetchEstadisticas();
    }
  }, [usuario, csrfToken]);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      window.location.href = '/';
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Función para renderizar el contenido según la vista seleccionada
  const renderContent = () => {
    switch (view) {
      case 'perfil':
        return (
          <motion.div
            key="perfil"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white/40 rounded-xl p-6 mb-8 md:mb-0 text-sm leading-loose shadow">
            {usuario && csrfToken && (
              <FormularioEdicionUsuario
                usuario={usuario}
                csrfToken={csrfToken}
                onUpdateSuccess={fetchUsuario}
              />
            )}
          </motion.div>
        );
      case 'clases':
        return (
          <motion.div
            key="clases"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white/40 rounded-xl p-6 mb-8 md:mb-0 text-sm leading-loose shadow">
            {usuario && csrfToken && (
              <ClasesTable csrfToken={csrfToken} onUpdateEstadisticas={fetchEstadisticas} />
            )}
          </motion.div>
        );
      case 'productos':
        return (
          <motion.div
            key="productos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white/40 rounded-xl p-6 mb-8 md:mb-0 text-sm leading-loose shadow">
            <h3 className="text-xl mb-4 text-blue-300">Tus productos comprados</h3>
            <p className="text-gray-300">Aquí verás el historial de tus productos.</p>
          </motion.div>
        );
      case 'instructor':
        return (
          <motion.div
            key="instructor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white/40 rounded-xl p-6 mb-8 text-sm leading-loose shadow">
            {usuario && csrfToken && (
              <AltaInstructorForm csrfToken={csrfToken} onCreationSuccess={fetchUsuario} />
            )}
          </motion.div>
        );
      case 'usuarios':
        return (
          <motion.div
            key="usuarios"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white/40 rounded-xl p-6 mb-8 md:mb-0 text-sm leading-loose shadow">
            {usuario && csrfToken && (
              <UsuariosTable
                usuario={usuario}
                csrfToken={csrfToken}
                onUpdateSuccess={fetchUsuario}
              />
            )}
          </motion.div>
        );
    }
  };

  const getButtonStyle = (key: string) => `
    ${view === key ? 'text-white bg-white/10 rounded-md' : 'text-gray-200'}
    hover:text-white cursor-pointer transition-colors w-full flex items-center justify-start ml-6 gap-2 py-2 px-3
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[270px_1fr] gap-4 md:gap-8">
      {/* Sidebar */}
      <aside className="bg-sky-950 h-[85vh] font-extrabold font-blowbrush tracking-widest rounded-2xl p-6 flex flex-col items-center shadow-lg w-full">
        <img
          src="/img/perfil/perfil.jpg"
          alt="avatar"
          className="w-30 h-30 my-3 rounded-full border-4 border-white"
        />
        <span className="text-xs text-gray-200 text-16 uppercase">Rol: {usuario?.rol}</span>

        <hr className="border-t my-auto border-white/20 w-full" />

        <ul className="space-y-2 w-full text-center">
          <li>
            <button onClick={() => setView('perfil')} className={getButtonStyle('perfil')}>
              <User className="w-5 h-5" />
              MI PERFIL
            </button>
          </li>
          <li>
            <button onClick={() => setView('clases')} className={getButtonStyle('clases')}>
              <School className="w-5 h-5" />
              MIS CLASES
            </button>
          </li>
          <li>
            <button onClick={() => setView('productos')} className={getButtonStyle('productos')}>
              <ShoppingBag className="w-5 h-5" />
              MIS PRODUCTOS
            </button>
          </li>

          {parsedSession.rol === 'admin' && (
            <li>
              <button
                onClick={() => setView('instructor')}
                className={getButtonStyle('instructor')}>
                <ClipboardList className="w-5 h-5" />
                ALTA INSTRUCTOR
              </button>
            </li>
          )}

          {parsedSession.rol === 'admin' && (
            <li>
              <button onClick={() => setView('usuarios')} className={getButtonStyle('usuarios')}>
                <UserRoundSearch className="w-5 h-5" />
                USUARIOS
              </button>
            </li>
          )}
        </ul>

        <hr className="border-t my-auto border-white/20 w-full" />

        <ul className="space-y-2 w-full text-center">
          <li>
            <button
              onClick={handleLogout}
              className="text-red-300 hover:text-red-100 cursor-pointer transition flex items-center justify-start mx-auto md:ml-9 gap-2">
              <LogOut className="w-5 h-5" />
              CERRAR SESIÓN
            </button>
          </li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <section className="flex flex-col gap-6">
        {/* Estadísticas */}
        <div className="bg-white/40 p-4 rounded-xl font-blowbrush tracking-widest text-center shadow">
          <AnimatePresence mode="wait">
            <motion.h3
              key={usuario?.nombre} // forzar animación cuando cambie el nombre
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="text-3xl text-sky-950 font-bold">
              ¡BIENVENIDO {usuario?.nombre?.toUpperCase() || 'USUARIO'}!
            </motion.h3>
          </AnimatePresence>
          <p className="text-gray-400 uppercase">
            Aquí puedes ver tus estadísticas y actividades recientes.
          </p>
        </div>
        {/* Resumen de actividad */}
        <div className="grid grid-cols-1 font-extrabold font-blowbrush tracking-widest sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/40 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg text-zinc-900">RESERVAS ACTIVAS</h3>
            <p className="text-3xl text-blue-600 font-bold">{reservasActivas.total}</p>
          </div>
          <div className="bg-white/40 p-4 rounded-xl  text-center shadow">
            <h3 className="text-lg text-zinc-900">CLASES PRÓXIMAS</h3>
            <p className="text-3xl text-blue-600 font-bold">{clasesProximas.total}</p>
          </div>
          <div className="bg-white/40 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg text-zinc-900">PRODUCTOS COMPRADOS</h3>
            <p className="text-3xl text-blue-600 font-bold">{productosReservados.total}</p>
          </div>
        </div>

        {/* Vista dinámica con animación */}
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </section>
    </div>
  );
}
