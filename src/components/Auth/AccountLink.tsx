
import { useEffect, useState } from 'react';


export default function AccountLink() {
  const location = window?.location.pathname;
  
  const handleClick = () => {
    sessionStorage.setItem('from', location);
  };

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

