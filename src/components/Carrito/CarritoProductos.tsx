'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Percent, BadgePercent } from 'lucide-react';
import ReservaCard from './ReservaCard';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const descuentoSchema = z.object({
  codigo: z.string().min(3, 'Mínimo 3 caracteres').max(20),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^4[0-9]{15}$/, 'Debe ser una tarjeta Visa válida'),
  expiry: z.string().refine(
    (val) => {
      const [mmStr, yyStr] = val.split('/');
      if (!mmStr || !yyStr || mmStr.length !== 2 || yyStr.length !== 2) return false;

      const mm = Number(mmStr);
      const yy = Number(yyStr);
      if (isNaN(mm) || isNaN(yy)) return false;

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;
      const maxYear = currentYear + 5;

      const isMonthValid = mm >= 1 && mm <= 12;
      const isYearInRange = yy >= currentYear && yy <= maxYear;
      const isNotExpired = yy > currentYear || (yy === currentYear && mm >= currentMonth);

      return isMonthValid && isYearInRange && isNotExpired;
    },
    {
      message: 'Fecha inválida o caducada. Usa formato MM/AA',
    }
  ),

  cvv: z.string().regex(/^\d{3}$/, 'El CVV debe tener 3 dígitos numéricos'),
});

type Props = {
  session: string;
};

export default function CarritoProductos({ session }: Props) {
  // Parse the session string to get user data
  const parsedSession = JSON.parse(session) as {
    isLogged: boolean;
    userId?: string;
    email?: string;
    rol?: string;
  };
  const [usuarioAutenticado] = useState(parsedSession?.isLogged || false);
  const [csrfToken, setCsrfToken] = useState('');
  const [reservas, setReservas] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [errorDescuento, setErrorDescuento] = useState('');
  const [impuestos, setImpuestos] = useState(0);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [successPago, setSuccessPago] = useState(false);
  const [pantallaCongelada, setPantallaCongelada] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');

  const total = subtotal - subtotal * descuento + impuestos;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include',
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error al obtener token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const fetchReservas = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/carrito/reservasActivas', {
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });
      const data = await res.json();
      setReservas(data.reservas);

      const nuevoSubtotal = data.reservas.reduce(
        (acc: number, r: { total: number }) => acc + r.total,
        0
      );
      setSubtotal(nuevoSubtotal);
      setImpuestos(nuevoSubtotal * 0.21);
    } catch (err) {
      console.error('Error al hacer fetch de reservas:', err);
    }
  };

  useEffect(() => {
    if (csrfToken) fetchReservas();
  }, [csrfToken]);

  const aplicarDescuento = async () => {
    setErrorDescuento('');
    const validacion = descuentoSchema.safeParse({ codigo });
    if (!validacion.success) {
      setErrorDescuento(validacion.error.errors[0].message);
      return;
    }
    const incluyeProductos = (reservas as any[]).some((r) => r.tipo === 'producto');
    const incluyeClases = (reservas as any[]).some((r) => r.tipo === 'clase');
    const cantidadProductos = (reservas as any[]).filter((r) => r.tipo === 'producto').length;

    let tipo: 'PRODUCTOS' | 'CLASES' | 'AMBOS' = 'PRODUCTOS';
    if (incluyeProductos && incluyeClases) tipo = 'AMBOS';
    else if (incluyeClases) tipo = 'CLASES';

    try {
      const res = await fetch('http://localhost:4000/api/descuentos/comprobarDescuento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ codigo, total: subtotal, tipo, cantidadProductos }),
      });
      const data = await res.json();
      if (res.ok && data.descuento) {
        const porcentaje = data.descuento.porcentaje / 100;
        setDescuento(porcentaje);
      } else {
        setErrorDescuento(data.error || 'Código inválido o no aplicable');
        setDescuento(0);
      }
    } catch (err) {
      setErrorDescuento('Error al validar el código');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(paymentSchema), mode: 'onChange' });

  const expiry = watch('expiry');
  useEffect(() => {
    if (expiry?.length === 2 && !expiry.includes('/')) {
      setValue('expiry', expiry + '/', { shouldValidate: true });
    }
  }, [expiry, setValue]);

  const onPay = async (data: any) => {
    return await procesarPagoYReservar();
  };

  const handlePago = handleSubmit(async (data) => {
    setSuccessPago(true); // mostrar animación

    const exito = await onPay(data);

    if (exito) {
      await fetchReservas();
      setPantallaCongelada(true); // congelar pantalla al iniciar
      setTimeout(() => {
        setSuccessPago(false); // quitar animación
        setPantallaCongelada(false);
        setMostrarPago(false); // cerrar modal
      }, 2000);
    } else {
      setPantallaCongelada(false);
    }
  });

  const procesarPagoYReservar = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/carrito/realizarPagoCarrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setMensajeModal(`❌ ${data.error || 'Error al reservar clase.'}`);
        return false;
      }

      return true;
    } catch (error) {
      setMensajeModal('❌ Error inesperado al procesar la reserva.');
      return false;
    }
  };

  return (
    <>
      {pantallaCongelada && <div className="fixed top-0 left-0 w-screen h-screen z-[999] " />}

      <div className="flex flex-col-reverse mt-18 xl:flex-row gap-10 p-4 sm:p-6 w-[95%] mx-auto">
        <div className="flex-1 w-full space-y-4">
          {reservas.length === 0 ? (
            <p className="text-2xl text-sky-950 font-blowbrush tracking-widest font-bold uppercase text-center italic">
              Aun no hay productos...
            </p>
          ) : (
            reservas.map((reserva, i) => (
              <ReservaCard
                key={i}
                reserva={reserva}
                actualizarReservas={fetchReservas}
                csrfToken={csrfToken}
              />
            ))
          )}
        </div>

        <aside className="w-full xl:max-w-[28%] h-fit bg-white border border-zinc-200 rounded-2xl shadow-xl p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-blowbrush text-sky-950 uppercase tracking-widest mb-4">
              Carrito
            </h2>
            <div className="flex justify-between items-center text-gray-800">
              <span className="flex items-center gap-2">
                <Store className="w-5 h-5 text-sky-950" />
                Recogida en tienda
              </span>
              <span className="text-sm font-medium">Bigfoot Store</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <BadgePercent className="w-5 h-5 text-sky-950" />
              Código promocional
            </label>
            <div className="flex">
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                type="text"
                className="flex-1 border border-zinc-300 rounded-l-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-950"
                placeholder="Introduce tu código"
              />
              <button
                onClick={aplicarDescuento}
                className="bg-sky-950 text-white px-4 rounded-r-lg text-sm hover:bg-sky-800 transition">
                Aplicar
              </button>
            </div>
            {errorDescuento && <p className="text-red-500 text-sm mt-1">{errorDescuento}</p>}
          </div>

          <div className="border-t border-zinc-200 pt-4 space-y-2 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Descuento aplicado
                </span>
                <span>-{(subtotal * descuento).toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Impuestos</span>
              <span>{impuestos.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-semibold text-lg text-sky-950">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (!usuarioAutenticado) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Inicia sesión para pagar',
                    text: 'Debes estar autenticado para finalizar la compra.',
                    confirmButtonText: 'Ir al login',
                  }).then((res) => {
                    if (res.isConfirmed) window.location.href = '/login';
                  });
                } else if (total === 0) {
                  Swal.fire({
                    icon: 'info',
                    title: 'No hay productos en el carrito',
                    text: '¿Quieres ir a la tienda para añadir productos?',
                    showCancelButton: true,
                    confirmButtonText: 'Ir a la tienda',
                    cancelButtonText: 'Cancelar',
                  }).then((res) => {
                    if (res.isConfirmed) window.location.href = '/equipos';
                  });
                } else {
                  setMostrarPago(true);
                }
              }}
              className="w-full bg-sky-950 hover:bg-sky-800 transition text-white py-3 rounded-lg font-bold">
              Proceder al pago
            </button>
            <div className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold">
              <motion.a
                href="/equipos"
                className="text-center w-full h-full py-3 flex items-center justify-center">
                Seguir comprando
              </motion.a>
            </div>
          </div>
        </aside>
      </div>
      {mostrarPago && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="relative bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-xl border border-blue-500"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white p-4 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-800 dark:text-white">
                Realiza tu reserva
              </h2>
              <h3 className="text-lg font-semibold mb-4 text-center text-blue-500">Tarjeta VISA</h3>
              <form onSubmit={handlePago} className="space-y-4">
                <div>
                  <input
                    {...register('cardNumber')}
                    type="text"
                    placeholder="Número de tarjeta"
                    maxLength={16}
                    className={`w-full px-4 py-2 rounded border ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    } dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input
                      {...register('expiry')}
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className={`w-full px-4 py-2 rounded border ${
                        errors.expiry ? 'border-red-500' : 'border-gray-300'
                      } dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}
                    />
                    {errors.expiry && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <input
                      {...register('cvv')}
                      type="password"
                      placeholder="CVV"
                      maxLength={3}
                      className={`w-full px-4 py-2 rounded border ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      } dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setMostrarPago(false)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-5 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    Cancelar
                  </button>
                  <motion.button
                    layout
                    type="submit"
                    disabled={successPago}
                    className={`${
                      successPago
                        ? 'w-14 h-14 rounded-full bg-green-500 flex justify-center items-center mx-auto'
                        : 'bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold shadow transition'
                    }`}
                    whileTap={{ scale: 0.95 }}>
                    {successPago ? (
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
                      'Pagar y Reservar'
                    )}
                  </motion.button>
                </div>
              </form>
              {/* Mensaje de error del modal */}
              {mensajeModal && (
                <p className="text-red-500 text-sm text-center font-semibold mt-4 w-full">
                  {mensajeModal}
                </p>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
