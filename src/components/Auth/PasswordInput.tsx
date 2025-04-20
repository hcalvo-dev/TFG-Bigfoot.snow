import { useState } from 'react';
import { YetiEyeOpen, YetiEyeClosed } from './YetiIcons';

export default function PasswordInput({ ...props }) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none"
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {show ? (
          <YetiEyeOpen className="w-6 h-6" />
        ) : (
        <YetiEyeClosed className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}