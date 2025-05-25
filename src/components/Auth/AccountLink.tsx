import { useState, useEffect, useRef } from 'react';
import { PUBLIC_API_URL } from '../config';

// Props que recibe el componente desde Astro
type Props = {
  session: string;
};

export default function AccountLinkWrapper({ session }: Props) {
  const parsedSession = JSON.parse(session) as {
    isLogged: boolean;
    userId?: string;
    email?: string;
    rol?: string;
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener token CSRF al montar el componente
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(PUBLIC_API_URL + '/api/csrf-token', {
          credentials: 'include',
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error al obtener token CSRF:', error);
      }
    };

    fetchCsrfToken();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const location = window.location.pathname;
      sessionStorage.setItem('from', location);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(PUBLIC_API_URL + '/api/auth/logout', {
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

  if (!parsedSession?.isLogged) {
    return (
      <a
        href="/login"
        onClick={handleClick}
        className="flex flex-col items-center text-black hover:text-blue-600 transition"
      >
        <img src="/img/icon_cuenta.svg" alt="Mi cuenta" className="w-8 h-8" />
        <span className="text-xs font-semibold font-blowbrush tracking-widest">
          MI CUENTA
        </span>
      </a>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex flex-col cursor-pointer items-center text-black hover:text-blue-600 transition"
      >
        <img src="/img/icon_cuenta.svg" alt="Mi cuenta" className="w-8 h-8" />
        <span className="text-xs font-semibold font-blowbrush tracking-widest">
          MI CUENTA
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-16 font-blowbrush tracking-widest shadow-lg rounded-lg p-2 z-50">
          <a href="/perfil" className="block px-4 py-2 hover:bg-gray-100">MI PERFIL</a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            CERRAR SESIÓN
          </button>
        </div>
      )}
    </div>
  );
}
