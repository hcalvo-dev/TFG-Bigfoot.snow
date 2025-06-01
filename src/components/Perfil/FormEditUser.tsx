import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordInput from '../Auth/PasswordInput';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { PUBLIC_API_URL } from '../config';

type Props = {
  usuario: { id: number; nombre: string; email: string; rol: string };
  csrfToken: string;
  onUpdateSuccess: () => void;
  permitirEditarRol?: boolean;
};

const schema = z
  .object({
    nombre: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 3, {
        message: 'Debe tener al menos 3 caracteres',
      }),
    email: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: 'Correo inválido',
      }),
    password: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_.:*;]).{6,}$/.test(val);
        },
        {
          message: 'Debe incluir mayúscula, minúscula, número y símbolo (-_.:*;)',
        }
      ),
    foto: z
      .any()
      .optional()
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          return files[0] instanceof File;
        },
        { message: 'Debes subir una imagen' }
      )
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          return files[0]?.size <= 2 * 1024 * 1024;
        },
        { message: 'La imagen no puede superar los 2MB' }
      ),

    confirmPassword: z.string().optional(),
    rol: z.enum(['user', 'admin', 'instructor']).optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      path: ['confirmPassword'],
      message: 'Las contraseñas no coinciden',
    }
  );

export default function FormularioEdicionUsuario({
  usuario,
  csrfToken,
  onUpdateSuccess,
  permitirEditarRol,
}: Props) {
  const [mensaje, setMensaje] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (formData: any) => {
    const camposActualizados: any = {};

    if (formData.nombre && formData.nombre !== usuario.nombre) {
      camposActualizados.nombre = formData.nombre;
    }
    if (formData.email && formData.email !== usuario.email) {
      camposActualizados.email = formData.email;
    }
    if (formData.password) {
      camposActualizados.password = formData.password;
    }
    if (formData.rol && formData.rol !== usuario.rol) {
      camposActualizados.rol = formData.rol;
    }

    const hayFoto = formData.foto?.length;

    if (!hayFoto && Object.keys(camposActualizados).length === 0) {
      setMensaje('❌ No se ha modificado ningún dato');
      setSuccess(false);
      return;
    }

    try {
      let body: BodyInit;
      let headers: HeadersInit = { 'CSRF-Token': csrfToken };

      if (hayFoto) {
        const formToSend = new FormData();
        formToSend.append('id', usuario.id.toString());
        Object.entries(camposActualizados).forEach(([key, val]) => {
            formToSend.append(key, String(val)); 
        });
        formToSend.append('foto', formData.foto[0]);
        body = formToSend;
        // No añadimos Content-Type, se establece solo
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({ id: usuario.id, ...camposActualizados });
      }

      const res = await fetch(PUBLIC_API_URL + '/api/user/update', {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body,
      });

      const response = await res.json();

      if (!res.ok) throw new Error(response.message || 'Error desconocido');

      setMensaje('✅ Datos actualizados correctamente');
      setSuccess(true);
      reset();
      onUpdateSuccess();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setMensaje(err.message || '❌ Error al actualizar los datos');
      setSuccess(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar',
    });

    if (result.isConfirmed) {
      setDeleting(true);
      try {
        const res = await fetch(PUBLIC_API_URL + '/api/user/delete', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({ id: usuario.id }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Error al eliminar cuenta');

        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (err: any) {
        Swal.fire('Error', err.message || 'No se pudo eliminar la cuenta', 'error');
        setDeleting(false);
      }
    }
  };
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (typeof usuario.rol === 'string') {
      // Solo cargar roles si es un admin editando otro usuario
      fetch(PUBLIC_API_URL + '/api/roles/get-Roles', {
        credentials: 'include',
        headers: { 'CSRF-Token': csrfToken },
      })
        .then((res) => res.json())
        .then((data) =>
          setRoles(
            data.map((r: any) => r.nombre).filter((nombre: string) => nombre !== 'instructor')
          )
        )
        .catch((err) => console.error('Error cargando roles:', err));
    }
  }, [usuario.rol]);

  return (
    <div className="relative">
      <div className="rounded-xl text-white">
        <h2 className="text-xl mb-4 font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
          Actualiza tus datos
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm w-full">
          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              NUEVO NOMBRE
            </label>
            <input
              {...register('nombre')}
              placeholder={usuario.nombre}
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.nombre ? 'border-red-500' : ''
              }`}
            />
            {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              NUEVO EMAIL
            </label>
            <input
              {...register('email')}
              placeholder={usuario.email}
              className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <AnimatePresence mode="wait">
            {permitirEditarRol && roles.length > 0 ? (
              <>
                <motion.div
                  key="rol"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}>
                  <div className="md:col-span-2">
                    <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
                      ROL
                    </label>
                    <select
                      {...register('rol')}
                      defaultValue={usuario.rol}
                      className="w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500">
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  {usuario.rol === 'instructor' && (
                    <div className="md:col-span-2">
                      <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
                        FOTO DE PERFIL
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
                  )}
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}>
                  <div>
                    <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
                      NUEVA CONTRASEÑA
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
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <div className="md:col-span-2 gap-6 flex flex-row justify-between items-center mt-2">
            {/* Botón guardar con animación */}
            <div className="w-full flex justify-start">
              <motion.button
                layout
                type="submit"
                disabled={success}
                className={`${
                  success
                    ? 'w-14 h-14 rounded-full bg-blue-600 flex justify-center items-center mx-auto'
                    : 'bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full shadow-md shadow-black/40'
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
                  'Guardar cambios'
                )}
              </motion.button>
            </div>

            {/* Botón eliminar ocupa todo su espacio */}
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold py-2 px-4 rounded shadow-md shadow-black/40 w-full">
                Eliminar cuenta
              </button>
            </div>
          </div>

          {typeof mensaje === 'string' && !success && mensaje.startsWith('❌') && (
            <p className="text-center text-sm font-semibold text-red-400">{mensaje}</p>
          )}
        </form>
      </div>

      <AnimatePresence>
        {deleting && (
          <motion.div
            className="fixed inset-0 z-50 bg-sky-950/10 bg-opacity-80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-red-700 to-red-400 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
