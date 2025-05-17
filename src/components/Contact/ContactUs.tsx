'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

const schema = z.object({
  name: z.string().min(3, 'Requerido').max(50, 'Máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(20, 'Mínimo 20 caracteres').max(500, 'Máximo 500 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function ContactUs() {
  const [charCount, setCharCount] = useState(0);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    clearErrors,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const messageValue = watch('message', '');

  useEffect(() => {
    setCharCount(messageValue.length);

    // Si ya había un error y el texto es válido, lo limpiamos
    if (errors.message && messageValue.length >= 20 && messageValue.length <= 500) {
      clearErrors('message');
    }
  }, [messageValue, errors.message, clearErrors]);

  const onSubmit = (data: FormData) => {
    console.log(data);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      reset();
      setCharCount(0);
    }, 2000);
  };

  return (
    <section className="w-full flex flex-col xl:flex-row items-center justify-center py-16 px-6 gap-10 max-w-7xl mx-auto">
      {/* Imagen */}
      <motion.img
        src="/img/contacto/snowteam.webp"
        alt="Snow Team"
        className="w-full mt-8 hidden md:block xl:w-1/2 aspect-[50/49] rounded-2xl shadow-lg object-cover"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Formulario + Texto */}
      <motion.div
        className="w-full xl:w-1/2 flex flex-col gap-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-blowbrush mt-8 md:mt-0 text-sky-950 font-extrabold tracking-widest uppercase">Conócenos</h2>
        <p className="text-gray-600 text-16 leading-relaxed">
          Estamos aquí para ayudarte a disfrutar al máximo tu experiencia en la nieve. Escríbenos para cualquier duda
          sobre clases, alquiler o recomendaciones de montaña.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            {...register('name')}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="email"
            placeholder="Correo electrónico"
            {...register('email')}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <div className="relative">
            <textarea
              placeholder="Tu mensaje"
              {...register('message')}
              maxLength={500}
              className="p-3 rounded-lg border border-gray-300 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="absolute bottom-2 right-3 text-sm text-gray-500">{charCount}/500</span>
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
          </div>

          {/* Botón personalizado con animación de éxito */}
          <div className="w-full flex justify-center mt-2">
            <motion.button
              layout
              type="submit"
              disabled={success}
              className={`${
                success
                  ? 'w-14 h-14 rounded-full bg-blue-600 flex justify-center items-center'
                  : 'bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full shadow-md shadow-black/40'
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
              ) : (
                'Enviar mensaje'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
