import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useState } from 'react';

const schema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(3, 'Debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'Debe tener al menos 10 caracteres'),
  porcentaje: z.coerce.number().min(1, 'Mínimo 1%').max(50, 'Máximo 50%'),
  aplicaEn: z.enum(['PRODUCTOS', 'CLASES', 'AMBOS'], {
    errorMap: () => ({ message: 'Debe seleccionar una opción válida' }),
  }),
  fechaValidez: z.string().refine(
    (val) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Elimina horas para comparación exacta
      const fecha = new Date(val);
      return fecha >= hoy;
    },
    { message: 'La fecha debe ser hoy o posterior' }
  ),
});

type Descuento = z.infer<typeof schema>;

type Props = {
  descuento?: Descuento;
  csrfToken: string;
  onSuccess: () => void;
};

export default function FormularioDescuento({ descuento, csrfToken, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Descuento>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...descuento,
      fechaValidez: descuento?.fechaValidez
        ? new Date(descuento.fechaValidez).toISOString().split('T')[0]
        : '',
    },
  });

  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: Descuento) => {
    const method = descuento?.id ? 'PATCH' : 'POST';
    const url = descuento?.id
      ? 'http://localhost:4000/api/descuentos/edit'
      : 'http://localhost:4000/api/descuentos/create';

    const res = await fetch(url, {
      method,
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
      const msg = await res.text();
      console.error('❌ Error al guardar descuento:', msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 text-sm pt-2">
      <div>
        <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
          CÓDIGO
        </label>
        <input
          {...register('codigo')}
          placeholder="Código del descuento"
          className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.codigo ? 'border-red-500' : ''
          }`}
        />
        {errors.codigo && <p className="text-red-400 text-sm mt-1">{errors.codigo.message}</p>}
      </div>

      <div>
        <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
          DESCRIPCIÓN
        </label>
        <textarea
          {...register('descripcion')}
          rows={2}
          placeholder="Descripción del descuento"
          className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.descripcion ? 'border-red-500' : ''
          }`}
        />
        {errors.descripcion && (
          <p className="text-red-400 text-sm mt-1">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
            PORCENTAJE
          </label>
          <input
            type="number"
            {...register('porcentaje')}
            placeholder="Ej: 20"
            className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.porcentaje ? 'border-red-500' : ''
            }`}
          />
          {errors.porcentaje && (
            <p className="text-red-400 text-sm mt-1">{errors.porcentaje.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
            APLICA EN
          </label>
          <select
            {...register('aplicaEn')}
            className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.aplicaEn ? 'border-red-500' : ''
            }`}>
            <option value="">Selecciona una opción</option>
            <option value="PRODUCTOS">Productos</option>
            <option value="CLASES">Clases</option>
            <option value="AMBOS">Ambos</option>
          </select>
          {errors.aplicaEn && (
            <p className="text-red-400 text-sm mt-1">{errors.aplicaEn.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
            FECHA DE VALIDEZ
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...register('fechaValidez')}
            className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.fechaValidez ? 'border-red-500' : ''
            }`}
          />
        </div>
      </div>

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
            `${descuento?.id  ? 'Actualizar' : 'Crear'} Descuento`
          )}
        </motion.button>
      </div>
    </form>
  );
}
