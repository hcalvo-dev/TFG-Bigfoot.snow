// src/components/AuthForm.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordInput from './PasswordInput'; 

// Defino el esquema de validación con Zod
const schema = z
.object({
  name: z.string().min(3, 'El nombre es obligatorio').optional(),
  email: z.string().email('Correo inválido'),
  password: z
  .string()
  .min(6, 'Mínimo 6 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_.:*;]).{6,}$/,
    'Debe incluir mayúscula, minúscula, número y símbolo (-_.:*;)'
  ),
  confirmPassword: z.string().optional(),
})
.refine((data) => {
  if (data.confirmPassword !== undefined && data.confirmPassword !== data.password) {
    return false;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Defino el componente AuthForm, que es el formulario de autenticación.
export default function AuthForm() {
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>(
    location.pathname === '/register' ? 'register' : 'login'
  );

  // useState se emplea para crear un estado local en un componente.
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  
  const {
    register, //Conecta los inputs al sistema de validación/control - Registra los datos.
    handleSubmit, // Ejecuta la validación y luego llama a tu función onSubmit.
    reset, // Reinicia el formulario a su estado inicial.
    formState: { errors }, // Contiene los errores de validación.
  } = useForm({ 
    resolver: zodResolver(schema), // Resuelve el schema de validación con Zod.
  });
  
  // hook de react que se ejecuta después de que el componente se monta.
  // Se utiliza para obtener el token CSRF del servidor.
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include',
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error('Error obteniendo CSRF token:', err);
      }
    };

    fetchCsrf();
  }, []);

  const onSubmit = async (data: any) => {
    const endpoint = mode === 'login' ? 'login' : 'register';
    const payload = mode === 'login'
      ? { email: data.email, password: data.password }
      : data;

    try {
      const res = await fetch(`http://localhost:4000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const response = await res.json();
      if (!res.ok) return setMessage(`❌ ${response.message || 'Error'}`);
      setMessage('');
      setSuccess(true);
      setTimeout(() => {
        window.location.href = from; 
      }, 1500);
    } catch (err) {
      setMessage('❌ ERROR AL CONECTAR CON EL SERVIDOR');
    }
  };

  return (
    <motion.div
      layout
      className="w-full max-w-5xl mx-auto flex rounded-3xl overflow-hidden shadow-2xl border border-blue-600 bg-zinc-900 h-[475px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Diagonal panel */}
      <motion.div
        className={`w-1/2 relative hidden md:flex flex-col justify-center items-center text-white p-10 overflow-hidden ${mode === 'login' ? 'order-2' : 'order-1'}`}
        style={{
          clipPath:
            mode === 'login'
              ? 'polygon(0 0, 100% 0, 100% 100%, 30% 100%)'
              : 'polygon(0 0, 70% 0, 100% 100%, 0% 100%)',
          paddingRight: mode === 'register' ? '70px' : undefined,
          paddingLeft: mode === 'login' ? '60px' : undefined,
          backgroundImage: `url(${mode === 'login' ? '/img/login/login.jpg' : '/img/login/register.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-black opacity-70 z-0 transition-all duration-700" />
        <div className={`relative z-10 text-center ${mode === 'login' ? 'pl-12' : 'pr-10'}`}>
          <h3 className="text-3xl font-black mb-4 uppercase tracking-widest font-blowbrush">
            {mode === 'login' ? '¡Bienvenido de nuevo!' : '¡Únete a la crew!'}
          </h3>
          <p className="text-zinc-200 max-w-xs">
            {mode === 'login'
              ? 'Conéctate para descubrir la experiencia Bigfoot. Snow, graff y flow urbano.'
              : 'Regístrate para deslizarte en un mundo lleno de arte callejero y adrenalina en la nieve.'}
          </p>
        </div>
      </motion.div>

      {/* Right side form */}
      <motion.div
        className={`w-full md:w-1/2 p-10 text-white flex flex-col justify-center ${mode === 'login' ? 'order-1' : 'order-2'}`}
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <motion.h2 layout className="text-4xl font-extrabold mb-8 uppercase tracking-widest font-blowbrush text-center">
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </motion.h2>
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {mode === 'register' && (
              <div>
                <input
                  {...register('name')}
                  placeholder="Usuario"
                  className={`px-3 py-[6px] rounded-md w-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 text-left">{errors.name.message}</p>}
              </div>
            )}
            <div>
              <input
                {...register('email')}
                placeholder="Correo electrónico"
                className={`px-3 py-[6px] rounded-md w-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>}
            </div>
            <div className="relative">
            <PasswordInput {...register('password')} placeholder="Contraseña" className={`px-3 py-[6px] rounded-md w-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border border-red-500' : ''}`} />
            {errors.password && <p className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</p>}
            </div>
            {mode === 'register' && (
              <div>
                <PasswordInput {...register('confirmPassword')} placeholder="Repetir contraseña" className={`px-3 py-[6px] rounded-md w-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border border-red-500' : ''}`} />      
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}
            <motion.button
            layout
            type="submit"
            disabled={success}
            className={`${
                success
                ? 'w-14 h-14 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 flex justify-center items-center mx-auto cursor-pointer'
                : 'bg-gradient-to-r from-blue-700 to-blue-500 text-white font-black rounded-md py-3 px-6 hover:scale-105 transition-transform duration-300 shadow-xl cursor-pointer'
            }`}
            whileTap={{ scale: 0.95 }}
            >
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
                transition={{ type: 'spring', stiffness: 300 }}
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
            ) : mode === 'login' ? (
                'Entrar'
            ) : (
                'Registrarse'
            )}
            </motion.button>

            {message && <p className="text-sm text-red-400 dark:text-red-300 text-left">{message}</p>}
          </motion.form>
        </AnimatePresence>
        <p className="mt-6 text-sm text-zinc-400 text-center">
          {mode === 'login' ? '¿NO TIENES CUENTA?' : '¿YA TIENES CUENTA?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              reset();
              setMessage('');
                // cambia la ruta sin recargar
              
              navigate(`/${mode === 'login' ? 'register' : 'login'}`);
            }}
            className="text-blue-400 hover:underline font-bold cursor-pointer"
          >
            {mode === 'login' ? 'REGÍSTRATE' : 'INICIA SESIÓN'}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
