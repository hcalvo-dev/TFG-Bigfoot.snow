import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordInput from '../Auth/PasswordInput';
import { PUBLIC_API_URL } from '../config';

type Props = {
  csrfToken: string;
  onCreationSuccess: () => void;
};

const schema = z
  .object({
    nombre: z.string().min(3, 'Debe tener al menos 3 caracteres'),
    email: z.string().email('Correo inválido'),
    password: z
      .string()
      .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_.:*;]).{6,}$/.test(val), {
        message: 'Debe incluir mayúscula, minúscula, número y símbolo (-_.:*;)',
      }),
    confirmPassword: z.string(),
    especialidad: z.enum(['snowboard', 'skii'], { message: 'Selecciona una especialidad' }),
    nivel: z.string().nonempty('Selecciona un nivel'),
    montanaId: z.string().nonempty('Selecciona una montaña'),
    testimonio: z
      .string()
      .min(50, 'El testimonio debe tener al menos 50 caracteres')
      .max(200, 'El testimonio no puede superar los 200 caracteres'),
    foto: z
      .any()
      .refine((files) => files?.[0] instanceof File, { message: 'Debes subir una imagen' })
      .refine((files) => files?.[0]?.size <= 2 * 1024 * 1024, {
        message: 'La imagen no puede superar los 2MB',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  });

export default function AltaInstructorForm({ csrfToken, onCreationSuccess }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [success, setSuccess] = useState(false);
  const [montanas, setMontanas] = useState<{ id: number; nombre: string }[]>([]);
  const [niveles, setNiveles] = useState<{ id: number; nombre: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    control, 
  } = useForm({
    resolver: zodResolver(schema),
  });

  const testimonioValue = useWatch({ name: 'testimonio', control });

  useEffect(() => {
    fetch(PUBLIC_API_URL + '/api/montanas/all', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    })
      .then((res) => res.json())
      .then((data) => setMontanas(data))
      .catch((err) => console.error('Error al cargar montañas:', err));

    fetch(PUBLIC_API_URL + '/api/nivel/all', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    })
      .then((res) => res.json())
      .then((data) => setNiveles(data))
      .catch((err) => console.error('Error al cargar niveles:', err));
  }, [csrfToken]);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('especialidad', data.especialidad);
      formData.append('nivel', data.nivel);
      formData.append('montanaId', data.montanaId);
      formData.append('foto', data.foto[0]);
      formData.append('testimonio', data.testimonio);

      const res = await fetch(PUBLIC_API_URL + '/api/instructor/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'CSRF-Token': csrfToken,
        },
        body: formData,
      });

      const response = await res.json();
      if (!res.ok) throw new Error(response.message || 'Error desconocido');

      setMensaje('✅ Instructor creado correctamente');
      setSuccess(true);
      reset();
      onCreationSuccess();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setMensaje(err.message || '❌ Error al crear el instructor');
      setSuccess(false);
    }
  };

  return (
    <div className="relative">
      <div className="rounded-xl text-white">
        <h2 className="text-xl mb-4 font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
          ALTA INSTRUCTOR
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm w-full">
          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              NOMBRE
            </label>
            <input
              {...register('nombre')}
              placeholder="Nombre"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.nombre ? 'border-red-500' : ''
              }`}
            />
            {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              EMAIL
            </label>
            <input
              {...register('email')}
              placeholder="Correo electrónico"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              CONTRASEÑA
            </label>
            <PasswordInput
              {...register('password')}
              placeholder="********"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              REPITE CONTRASEÑA
            </label>
            <PasswordInput
              {...register('confirmPassword')}
              placeholder="********"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              ESPECIALIDAD
            </label>
            <select
              {...register('especialidad')}
              className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.especialidad ? 'border-red-500' : ''
              }`}>
              <option value="">Selecciona una opción</option>
              <option value="snowboard">Snowboard</option>
              <option value="skii">Skii</option>
            </select>
            {errors.especialidad && (
              <p className="text-red-400 text-sm mt-1">{errors.especialidad.message}</p>
            )}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              NIVEL
            </label>
            <select
              {...register('nivel')}
              className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.nivel ? 'border-red-500' : ''
              }`}>
              <option value="">Selecciona un nivel</option>
              {niveles.map((nivel) => (
                <option key={nivel.id} value={nivel.id}>
                  {nivel.nombre}
                </option>
              ))}
            </select>
            {errors.nivel && <p className="text-red-400 text-sm mt-1">{errors.nivel.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              FOTO
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('foto')}
              className={`w-full p-2 rounded bg-[#1f2937] text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-700 file:text-white hover:file:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            />
            {errors.foto && typeof errors.foto.message === 'string' && (
              <p className="text-red-400 text-sm mt-1">{errors.foto.message}</p>
            )}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              MONTAÑA
            </label>
            <select
              {...register('montanaId')}
              className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.montanaId ? 'border-red-500' : ''
              }`}>
              <option value="">Selecciona una montaña</option>
              {montanas.map((montana) => (
                <option key={montana.id} value={montana.id}>
                  {montana.nombre}
                </option>
              ))}
            </select>
            {errors.montanaId && (
              <p className="text-red-400 text-sm mt-1">{errors.montanaId.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              TESTIMONIO
            </label>
            <textarea
              {...register('testimonio')}
              rows={4}
              placeholder="Cuenta brevemente tu experiencia, enfoque o motivación..."
              maxLength={200}
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.testimonio ? 'border-red-500' : ''
              }`}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>{testimonioValue?.length || 0}/200 caracteres</span>
              {errors.testimonio && (
                <span className="text-red-400">{errors.testimonio.message}</span>
              )}
            </div>
          </div>

          <div className="w-full md:col-span-2 flex justify-center mt-2">
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
                'Alta Instructor'
              )}
            </motion.button>
          </div>

          {typeof mensaje === 'string' && !success && mensaje.startsWith('❌') && (
            <p className="text-center text-sm font-semibold text-red-400 md:col-span-2">
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
