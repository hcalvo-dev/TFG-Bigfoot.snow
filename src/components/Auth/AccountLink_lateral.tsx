import { useEffect, useState } from 'react';

export default function AccountLink_lateral() {
  const location = window?.location.pathname;
  
  
  const handleClick = () => {
    sessionStorage.setItem('from', location);
  };

  return (
    <a
      href="/login"
      onClick={handleClick}
      className="flex justify-center items-center space-x-2 text-standard font-blowbrush tracking-widest text-white"
    >
      <img src="/img/icon_cuenta_white.svg" alt="Mi cuenta" className="w-8 h-8 m-0 pr-0.75" />
      <span className="pt-1 pl-1.25 hover:text-blue-600 transition-colors">
        MI CUENTA
      </span>
    </a>
  );
}

