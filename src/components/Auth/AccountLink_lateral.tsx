import { useEffect, useRef, useState } from 'react';

type Props = {
  session: string;
};

export default function AccountLinkWrapper_lateral({ session }: Props) {
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

  if (!parsedSession?.isLogged) {
    return (
      <a
        href="/login"
        onClick={handleClick}
        className="flex justify-center items-center space-x-1 text-standard font-blowbrush tracking-widest text-white"
      >
        <img src="/img/icon_cuenta_white.svg" alt="Mi cuenta" className="w-8 h-8 m-0 pr-1" />
        <span className="pt-1 hover:text-blue-600 transition-colors">
          MI CUENTA
        </span>
      </a>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="flex justify-center items-center space-x-2 text-standard font-blowbrush tracking-widest text-white relative"
    >
      <button onClick={() => setShowDropdown(!showDropdown)} className="flex cursor-pointer items-center space-x-1">
        <img src="/img/icon_cuenta_white.svg" alt="Mi cuenta" className="w-8 h-8 m-0 pr-1" />
        <span className="pt-1  hover:text-blue-600 transition-colors">
          MI CUENTA
        </span>
      </button>

      {showDropdown && (
        <div className="absolute left-0 top-10 w-full text-sm bg-white border border-gray-300 rounded shadow z-50 text-black">
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
