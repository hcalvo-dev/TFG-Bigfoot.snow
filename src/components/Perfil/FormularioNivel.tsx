import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PUBLIC_API_URL } from '../config';

const schema = z.object({
  id: z.number(),
  nombre: z.string(),
  precio: z.coerce.number().min(10, 'El precio debe ser mayor que 10'),
});

type Nivel = {
  id: number;
  nombre: string;
  precio: number;
};

type Props = {
  nivel: Nivel;
  csrfToken: string;
  onSuccess: () => void;
};

export default function FormularioNivel({ nivel, csrfToken, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: nivel,
  });

  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: Nivel) => {
    const res = await fetch(PUBLIC_API_URL + '/api/nivel/edit', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        reset();
        onSuccess(); 
      }, 2000);
    } else {
      const text = await res.text();
      console.error('❌ Error al actualizar nivel:', text);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 text-sm pt-4">
      {/* Nombre (deshabilitado) */}
      <div>
        <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
          NOMBRE
        </label>
        <input
          {...register('nombre')}
          disabled
          className="w-full p-2 rounded bg-gray-100 text-gray-600 border border-white/20"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
          PRECIO (€)
        </label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ej: 35.00"
          {...register('precio', {
            setValueAs: (v) => {
              if (typeof v === 'string') {
                const limpio = v.replace(',', '.');
                const numero = parseFloat(limpio);
                return isNaN(numero) ? 0 : numero;
              }
              return Number(v);
            },
          })}
          className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.precio ? 'border-red-500' : ''
          }`}
        />
        {errors.precio && <p className="text-red-400 text-sm mt-1">{errors.precio.message}</p>}
      </div>

      {/* Botón */}
      <div className="w-full flex justify-center mt-2">
        <motion.button
          layout
          type="submit"
          disabled={success}
          className={`${
            success
              ? 'w-14 h-14 rounded-full bg-blue-500 flex justify-center items-center mx-auto'
              : 'bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full shadow-md shadow-black/40'
          }`}
          whileTap={{ scale: 0.95 }}>
          {success ? (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          ) : (
            'Actualizar Nivel'
          )}
        </motion.button>
      </div>
    </form>
  );
}
