import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Wallet, ShoppingCart } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { PUBLIC_API_URL } from '../config';
import NotificacionGlobal from '../ui/NotificacionGlobal';
import { toast } from 'react-hot-toast';

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

export default function ReservarClase({ session }: Props) {
  // Parse the session string to get user data
  const parsedSession = JSON.parse(session) as {
    isLogged: boolean;
    userId?: string;
    email?: string;
    rol?: string;
  };
  const [usuarioAutenticado] = useState(parsedSession?.isLogged || false);

  const [montanas, setMontanas] = useState<{ id: number; nombre: string }[]>([]);
  const [niveles, setNiveles] = useState<{ id: number; nombre: string; precio: number }[]>([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [montanaId, setMontanaId] = useState('');
  const [instructores, setInstructores] = useState<any[]>([]);
  const [instructorSeleccionado, setInstructorSeleccionado] = useState<any | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horasDisponibles, setHorasDisponibles] = useState<any[]>([]);
  const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [mensajeModal, setMensajeModal] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const tablaRef = useRef<HTMLDivElement | null>(null);
  const [successAñadir, setSuccessAñadir] = useState(false);
  const [successPagar, setSuccessPagar] = useState(false);
  const [pantallaCongelada, setPantallaCongelada] = useState(false);

  const nivelActivo = niveles.find((n) => n.id.toString() === nivelSeleccionado);
  const precioTotal = (nivelActivo?.precio ?? 0) * horasSeleccionadas.length;

  const toggleHora = (hora: string) => {
    setHorasSeleccionadas((prev) =>
      prev.includes(hora) ? prev.filter((h) => h !== hora) : [...prev, hora]
    );
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(PUBLIC_API_URL + '/api/csrf-token', {
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

  useEffect(() => {
    if (montanaId && especialidad && nivelSeleccionado && fechaSeleccionada) {
      fetch(PUBLIC_API_URL + '/api/instructor/disponibles', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ montanaId, especialidad }),
      })
        .then((res) => res.json())
        .then((data) => {
          setInstructores(data);
          setInstructorSeleccionado(null); // ← Se resetea el instructor seleccionado
          setHorasSeleccionadas([]);
          setMensaje(data.length === 0 ? 'No hay instructores disponibles.' : '');
        })
        .catch((err) => console.error('Error al obtener instructores:', err));
    }
  }, [montanaId, especialidad, nivelSeleccionado, fechaSeleccionada]);

  useEffect(() => {
    if (instructorSeleccionado && fechaSeleccionada) {
      fetch(PUBLIC_API_URL + '/api/instructor/horarios', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          montanaId,
          especialidad,
          fechaSeleccionada,
          instructorId: instructorSeleccionado.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setHorasDisponibles(data);
          setHorasSeleccionadas([]);
        })
        .catch((err) => console.error('Error al obtener horarios:', err));
    }
  }, [instructorSeleccionado, fechaSeleccionada]);

  const añadirAlCarrito = async () => {
    try {
      const item = {
        montanaId,
        especialidad,
        fecha: fechaSeleccionada,
        horas: horasSeleccionadas,
        montana: montanaId,
        instructorId: instructorSeleccionado?.id,
        nivelId: nivelSeleccionado,
        precio: precioTotal,
      };

      const res = await fetch(PUBLIC_API_URL + '/api/carrito/reservaClase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(item),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.horasReservadas?.length > 0) {
            setMensaje(data.message);
            setHorasSeleccionadas([]);

            // Refrescar horarios tras reservar
            fetch(PUBLIC_API_URL + '/api/instructor/horarios', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
              },
              body: JSON.stringify({
                montanaId,
                especialidad,
                fechaSeleccionada,
                instructorId: instructorSeleccionado?.id,
              }),
            })
              .then((res) => res.json())
              .then(setHorasDisponibles)
              .catch((err) => console.error('Error actualizando horarios:', err));
          } else {
            setMensajeModal('❌ Las horas seleccionadas ya no están disponibles.');
          }
        })
        .catch(() => {
          setMensajeModal('❌ Error inesperado al procesar la reserva.');
        });

      setTimeout(() => {
        setMostrarModal(false);
        setHorasSeleccionadas([]);
      }, 1500);
    } catch (err) {
      console.error('Error al añadir al carrito:', err);
      setMensajeModal('❌ Error al añadir al carrito.');
    }
  };

  const procesarPagoYReservar = async () => {
    try {
      const res = await fetch(PUBLIC_API_URL + '/api/reserva/clase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({
          montanaId,
          especialidad,
          fecha: fechaSeleccionada,
          horas: horasSeleccionadas,
          instructorId: instructorSeleccionado?.id,
          nivelId: nivelSeleccionado,
          precio: precioTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensajeModal(`❌ ${data.error || 'Error al reservar clase.'}`);
        return false;
      }

      if (data?.horasReservadas?.length > 0) {
        setMensaje(data.message);
        setHorasSeleccionadas([]);

        await fetch(PUBLIC_API_URL + '/api/instructor/horarios', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          body: JSON.stringify({
            montanaId,
            especialidad,
            fechaSeleccionada,
            instructorId: instructorSeleccionado?.id,
          }),
        })
          .then((res) => res.json())
          .then(setHorasDisponibles)
          .catch((err) => console.error('Error actualizando horarios:', err));

        return true;
      } else {
        setMensajeModal('❌ Las horas seleccionadas ya no están disponibles.');
        return false;
      }
    } catch (error) {
      setMensajeModal('❌ Error inesperado al procesar la reserva.');
      return false;
    }
  };

  const {
    register: registerCard,
    handleSubmit: handlePayment,
    formState: { errors: paymentErrors },
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(paymentSchema), mode: 'onChange' });

  const tarjeta = watch('expiry');
  useEffect(() => {
    if (tarjeta && tarjeta.length === 2 && !tarjeta.includes('/')) {
      setValue('expiry', tarjeta + '/', { shouldValidate: true });
    }
  }, [tarjeta, setValue]);

  const onPay = async (data: any) => {
    return await procesarPagoYReservar();
  };

  const confirmarReserva = () => {
    if (!usuarioAutenticado) {
      Swal.fire({
        title: 'Inicia sesión para continuar',
        text: 'Serás redirigido al login y podrías perder los datos seleccionados.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ir al login',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }

    setMostrarPago(true);
  };

  // Reiniciar el modal y el pago
  const cerrarModal = () => {
    setMostrarModal(false);
    setMostrarPago(false);
    setMensajeModal('');
  };

  const handleCarrito = async () => {
    await añadirAlCarrito();
    setPantallaCongelada(true);
    setSuccessAñadir(true);
    setTimeout(() => {
      setSuccessAñadir(false);
      setPantallaCongelada(false);
      cerrarModal();
    }, 2000);
  };

  const handlePagarSeguro = handlePayment(async (data) => {
    setPantallaCongelada(true);

    const exito = await onPay(data);

    if (exito) {
      setSuccessPagar(true);
      toast.success('Enviando ticket de compra al correo');
      setTimeout(() => {
        setSuccessPagar(false);
        setPantallaCongelada(false);
        cerrarModal();
      }, 2000);
    } else {
      setPantallaCongelada(false);
      // No cerramos modal, se queda para mostrar mensaje de error
    }
  });
  return (
    <>
      <NotificacionGlobal />
      {pantallaCongelada && <div className="fixed top-0 left-0 w-screen h-screen z-[999] " />}
      <section className="min-h-[50vh] px-6 py-16 ">
        <div className="max-w-3xl mt-4 mx-auto text-center mb-12">
          <h1 className="text-4xl font-blowbrush tracking-widest font-bold uppercase text-sky-950 mb-4">
            ¿Quieres iniciarte en la práctica del <br></br> Skii o Snowboard?
          </h1>
          <p className="text-gray-600 leading-relaxed">
            ¿Te apetece mejorar tu técnica? En <strong>Bigfoot</strong> te lo ponemos fácil:
            disfruta aprendiendo al máximo en nuestras pistas, sin colas y con clases que se
            convertirán en una experiencia inolvidable.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          <select
            onChange={(e) => setMontanaId(e.target.value)}
            aria-label="Elige una estación"
            defaultValue=""
            className="p-3 rounded-xl border-2 border-blue-400 shadow">
            <option value="" disabled>
              Elige tu estación
            </option>
            {montanas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          <input
            type="date"
            aria-label="Selecciona una fecha"
            className="p-3 rounded-xl border-2 border-blue-400 shadow"
            min={(() => {
              const mañana = new Date();
              mañana.setDate(mañana.getDate() + 1);
              return mañana.toISOString().split('T')[0];
            })()}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          />

          <select
            onChange={(e) => setEspecialidad(e.target.value)}
            defaultValue=""
            aria-label="Selecciona una especialidad"
            className="p-3 rounded-xl border-2 border-blue-400 shadow">
            <option value="" disabled>
              Especialidad
            </option>
            <option value="skii">Skii</option>
            <option value="snowboard">Snowboard</option>
          </select>

          <select
            value={nivelSeleccionado}
            aria-label="Selecciona el nivel"
            onChange={(e) => setNivelSeleccionado(e.target.value)}
            className="p-3 rounded-xl border-2 border-blue-400 shadow">
            <option value="" disabled>
              Elige tu nivel
            </option>
            {niveles.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {mensaje && <p className="text-center text-red-500 font-semibold mb-8">{mensaje}</p>}

        {instructores.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {instructores.map((instr) => (
              <div
                key={instr.id}
                onClick={() => {
                  setInstructorSeleccionado(instr);
                  setTimeout(() => {
                    if (tablaRef.current) {
                      const offsetTop =
                        tablaRef.current.getBoundingClientRect().top + window.pageYOffset;
                      const headerOffset = 250;
                      window.scrollTo({ top: offsetTop - headerOffset, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg group transition-transform duration-200 hover:scale-105 ${
                  instructorSeleccionado?.id === instr.id ? 'ring-4 ring-blue-500' : ''
                }`}>
                <div className="relative w-full h-[40vh] bg-gray-200">
                  <img
                    src={`${PUBLIC_API_URL}${instr.fotoUrl}`}
                    alt={`Foto de ${instr.usuario.nombre}`}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition duration-300 ${
                      instructorSeleccionado?.id === instr.id
                        ? ''
                        : 'grayscale group-hover:grayscale-0'
                    }`}
                  />
                </div>
                <div className="p-4 text-center bg-white dark:bg-gray-800">
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                    {instr.usuario.nombre}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {instructorSeleccionado && horasDisponibles.length > 0 && nivelSeleccionado && (
          <div ref={tablaRef} className="relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-sm rounded-xl text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="w-4 p-4 text-left align-middle">
                    <span className="font-medium text-gray-900 whitespace-nowrap dark:text-blue-200">
                      {instructorSeleccionado?.usuario.nombre ?? ''}
                    </span>
                  </th>
                  <th className="px-8 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Hora
                  </th>
                  <th className="px-8 py-3 font-medium text-gray-900 dark:text-white">Estado</th>
                  <th className="px-8 py-3 font-medium text-gray-900 dark:text-white">Precio</th>
                  <th className="px-8 py-3 font-medium text-gray-900 dark:text-white">Acción</th>
                </tr>
              </thead>
              <tbody>
                {horasDisponibles.map((hora, i) => (
                  <tr
                    key={i}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="w-4 p-4">
                      <input
                        type="checkbox"
                        aria-label="Seleccion de horas"
                        disabled={!hora.disponible}
                        checked={horasSeleccionadas.includes(hora.hora)}
                        onChange={() => toggleHora(hora.hora)}
                        className="text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-8 py-4 font-medium text-gray-900 dark:text-white">
                      {hora.hora}
                      {fechaSeleccionada && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(() => {
                            const date = new Date(fechaSeleccionada);
                            const dias = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'];
                            const letraDia = dias[date.getDay()];
                            const dia = String(date.getDate()).padStart(2, '0');
                            const mes = String(date.getMonth() + 1).padStart(2, '0');
                            const anio = date.getFullYear();
                            return `${letraDia} - ${dia}-${mes}-${anio}`;
                          })()}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      {hora.disponible ? (
                        <span className="text-green-500 font-semibold">Disponible</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Ocupada</span>
                      )}
                    </td>
                    <td className="px-8 py-4 font-medium text-gray-900 dark:text-white">
                      {nivelActivo?.precio ?? '-'}€
                    </td>
                    <td className="px-8 py-4">
                      {hora.disponible && (
                        <button
                          onClick={() => toggleHora(hora.hora)}
                          className="bg-blue-600 text-white font-bold py-1 px-4 rounded hover:bg-blue-700">
                          {horasSeleccionadas.includes(hora.hora) ? 'Quitar' : 'Seleccionar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {horasSeleccionadas.length > 0 && (
          <div className="mt-6 bg-[#1f2937] text-white p-6 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <Wallet className="w-10 h-10 text-blue-400 animate-bounce" />
              <div className="md:ml-8">
                <p className="text-lg font-semibold">¡Listo para deslizar en la nieve!</p>
                <p className="text-sm text-gray-300">Confirma tu reserva y asegura tu clase.</p>
              </div>
            </div>
            <div className="text-right md:text-right w-full md:w-auto">
              <p className="text-xl font-bold mt-4 md:mt-0">
                Total a pagar: <span className="text-2xl text-white">{precioTotal}€</span>
              </p>
              <button
                onClick={() => setMostrarModal(true)}
                className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 px-6 rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition-transform transform hover:scale-105 w-full md:w-auto">
                Reservar clase
              </button>
            </div>
          </div>
        )}

        {mostrarModal && (
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
                  Resumen de tu reserva
                </h2>
                <div className="space-y-4 text-gray-800 dark:text-gray-300 text-base px-2">
                  <p>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Monitor:</span>{' '}
                    {instructorSeleccionado?.usuario.nombre}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Fecha:</span>{' '}
                    {fechaSeleccionada}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Horas:</span>{' '}
                    {horasSeleccionadas.join(', ')}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold text-green-600 dark:text-green-400">Total:</span>{' '}
                    <span className="text-xl font-bold">{precioTotal}€</span>
                  </p>
                </div>

                {/* Si el usuario está autenticado, mostrar pago. Si no, redirige al login */}
                {mostrarPago ? (
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}>
                    <h3 className="text-lg font-semibold mb-4 text-center text-blue-500">
                      Tarjeta VISA
                    </h3>
                    <form className="space-y-4" onSubmit={handlePayment(onPay)}>
                      <div>
                        <input
                          {...registerCard('cardNumber')}
                          type="text"
                          placeholder="Número de tarjeta"
                          maxLength={16}
                          className={`w-full px-4 py-2 rounded border ${
                            paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          } dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}
                        />
                        {paymentErrors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {paymentErrors.cardNumber.message}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <input
                            {...registerCard('expiry')}
                            type="text"
                            placeholder="MM/AA"
                            maxLength={5}
                            className={`w-full px-4 py-2 rounded border ${
                              paymentErrors.expiry ? 'border-red-500' : 'border-gray-300'
                            } dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}
                          />
                          {paymentErrors.expiry && (
                            <p className="text-red-500 text-sm mt-1">
                              {paymentErrors.expiry.message}
                            </p>
                          )}
                        </div>
                        <div className="w-1/2">
                          <input
                            {...registerCard('cvv')}
                            type="password"
                            placeholder="CVV"
                            maxLength={3}
                            className={`w-full px-4 py-2 rounded border ${
                              paymentErrors.cvv ? 'border-red-500' : 'border-gray-300'
                            } dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}
                          />
                          {paymentErrors.cvv && (
                            <p className="text-red-500 text-sm mt-1">{paymentErrors.cvv.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={cerrarModal}
                          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-5 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                          Cancelar
                        </button>
                        <motion.button
                          layout
                          type="submit"
                          onClick={handlePagarSeguro}
                          disabled={successPagar}
                          className={`${
                            successPagar
                              ? 'w-14 h-14 rounded-full bg-green-500 flex justify-center items-center mx-auto'
                              : 'bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold shadow transition'
                          }`}
                          whileTap={{ scale: 0.95 }}>
                          {successPagar ? (
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
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
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
                ) : (
                  <div className="flex flex-col items-end gap-4 mt-8">
                    <div className="flex justify-end gap-4 w-full">
                      <button
                        onClick={cerrarModal}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-5 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        Cancelar
                      </button>
                      <motion.button
                        layout
                        type="button"
                        onClick={handleCarrito}
                        disabled={successAñadir}
                        className={`${
                          successAñadir
                            ? 'w-14 h-14 rounded-full bg-green-500 flex justify-center items-center mx-auto'
                            : 'bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold shadow transition'
                        }`}
                        whileTap={{ scale: 0.95 }}>
                        {successAñadir ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}>
                            <ShoppingCart className="w-6 h-6 text-white" />
                          </motion.span>
                        ) : (
                          'Añadir al carrito'
                        )}
                      </motion.button>
                      <button
                        onClick={confirmarReserva}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow transition">
                        Pagar ahora
                      </button>
                    </div>

                    {/* Mensaje de error del modal */}
                    {mensajeModal && (
                      <p className="text-red-500 text-sm text-center font-semibold mt-4 w-full">
                        {mensajeModal}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </>
  );
}
