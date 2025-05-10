import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordInput from '../Auth/PasswordInput';

type Props = {
  csrfToken: string;
  onCreationSuccess: () => void;
};

const schema = z
  .object({
    nombre: z.string().min(3, 'Debe tener al menos 3 caracteres'),
    email: z.string().email('Correo inválido'),
    password: z.string().refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_.:*;]).{6,}$/.test(val), {
      message: 'Debe incluir mayúscula, minúscula, número y símbolo (-_.:*;)',
    }),
    confirmPassword: z.string(),
    especialidad: z.enum(['snowboard', 'skii'], { required_error: 'Selecciona una especialidad' }),
    experiencia: z.coerce.number().min(0, 'Debe ser un número positivo'),
    foto: z.any(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  });

export default function AltaInstructorForm({ csrfToken, onCreationSuccess }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: any) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fotoBase64 = reader.result?.toString();

        const res = await fetch('http://localhost:4000/api/instructor/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            especialidad: formData.especialidad,
            experiencia: Number(formData.experiencia),
            fotoBase64,
            rol: 'instructor',
          }),
        });

        const response = await res.json();
        if (!res.ok) throw new Error(response.message || 'Error desconocido');

        setMensaje('✅ Instructor creado correctamente');
        setSuccess(true);
        reset();
        onCreationSuccess();
        setTimeout(() => setSuccess(false), 2000);
      };

      if (formData.foto && formData.foto.length > 0) {
        reader.readAsDataURL(formData.foto[0]);
      } else {
        throw new Error('Debes subir una imagen');
      }
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm w-full">
          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">NOMBRE</label>
            <input
              {...register('nombre')}
              placeholder="Nombre"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.nombre ? 'border-red-500' : ''}`}
            />
            {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">EMAIL</label>
            <input
              {...register('email')}
              placeholder="Correo electrónico"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">ESPECIALIDAD</label>
            <select
              {...register('especialidad')}
              className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.especialidad ? 'border-red-500' : ''}`}
            >
              <option value="">Selecciona una opción</option>
              <option value="snowboard">Snowboard</option>
              <option value="skii">Skii</option>
            </select>
            {errors.especialidad && <p className="text-red-400 text-sm mt-1">{errors.especialidad.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">EXPERIENCIA (años)</label>
            <input
              type="number"
              {...register('experiencia')}
              placeholder="0"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.experiencia ? 'border-red-500' : ''}`}
            />
            {errors.experiencia && <p className="text-red-400 text-sm mt-1">{errors.experiencia.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">FOTO</label>
            <input
              type="file"
              accept="image/*"
              {...register('foto')}
              className={`w-full p-2 rounded bg-[#1f2937] text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-700 file:text-white hover:file:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            />
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">CONTRASEÑA</label>
            <PasswordInput
              {...register('password')}
              placeholder="********"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">REPITE CONTRASEÑA</label>
            <PasswordInput
              {...register('confirmPassword')}
              placeholder="********"
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="md:col-span-2 flex justify-center mt-2">
            <motion.button
              layout
              type="submit"
              disabled={success}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded shadow-md shadow-black/40"
              whileTap={{ scale: 0.95 }}
            >
              Dar de Alta Instructor
            </motion.button>
          </div>

          {typeof mensaje === 'string' && !success && mensaje.startsWith('❌') && (
            <p className="text-center text-sm font-semibold text-red-400 md:col-span-2">{mensaje}</p>
          )}
        </form>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 z-50 bg-sky-950/10 bg-opacity-80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-green-700 to-green-400 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
