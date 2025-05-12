import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export default function ReservarClase() {
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
  const [csrfToken, setCsrfToken] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const tablaRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    fetch('http://localhost:4000/api/montanas/all', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    })
      .then((res) => res.json())
      .then((data) => setMontanas(data))
      .catch((err) => console.error('Error al cargar montañas:', err));

    fetch('http://localhost:4000/api/nivel/all', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    })
      .then((res) => res.json())
      .then((data) => setNiveles(data))
      .catch((err) => console.error('Error al cargar niveles:', err));
  }, [csrfToken]);

  useEffect(() => {
    if (montanaId && especialidad && nivelSeleccionado && fechaSeleccionada) {
      fetch('http://localhost:4000/api/instructor/disponibles', {
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
      fetch('http://localhost:4000/api/instructor/horarios', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ montanaId, especialidad, fechaSeleccionada }),
      })
        .then((res) => res.json())
        .then((data) => {
          setHorasDisponibles(data);
          setHorasSeleccionadas([]); // ← Aquí también se limpian las horas seleccionadas
        })
        .catch((err) => console.error('Error al obtener horarios:', err));
    }
  }, [instructorSeleccionado, fechaSeleccionada]);

  const confirmarReserva = () => {
    fetch('/api/reserva/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        montanaId,
        especialidad,
        fecha: fechaSeleccionada,
        horas: horasSeleccionadas,
        instructorId: instructorSeleccionado?.id,
        nivelId: nivelSeleccionado,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMensaje(data.message || 'Clase reservada con éxito.');
        setHorasSeleccionadas([]);
        setMostrarModal(false);
      });
  };

  return (
    <section className="min-h-[50vh] px-6 py-16 ">
      <div className="max-w-3xl mt-4 mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-sky-950 mb-4">
          ¿Quieres iniciarte en la práctica del <br></br> Skii o Snowboard?
        </h1>
        <p className="text-gray-600 leading-relaxed">
          ¿Te apetece mejorar tu técnica? En <strong>Bigfoot</strong> te lo ponemos fácil: disfruta
          aprendiendo al máximo en nuestras pistas, sin colas y con clases que se convertirán en una
          experiencia inolvidable.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
        <select
          onChange={(e) => setMontanaId(e.target.value)}
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
          className="p-3 rounded-xl border-2 border-blue-400 shadow">
          <option value="" disabled>
            Especialidad
          </option>
          <option value="skii">Skii</option>
          <option value="snowboard">Snowboard</option>
        </select>

        <select
          value={nivelSeleccionado}
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
              className={`cursor-pointer rounded-xl overflow-hidden shadow group transition-transform duration-200 hover:scale-105 ${
                instructorSeleccionado?.id === instr.id ? 'ring-4 ring-blue-500' : ''
              }`}>
              <img
                src={instr.fotoUrl}
                alt={instr.usuario.nombre}
                className={`w-full h-72 object-cover object-top transition duration-300 ${
                  instructorSeleccionado?.id === instr.id ? '' : 'grayscale group-hover:grayscale-0'
                }`}
              />
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg text-gray-800">{instr.usuario.nombre}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {instructorSeleccionado && horasDisponibles.length > 0 && nivelSeleccionado && (
        <div ref={tablaRef} className="relative overflow-x-auto  sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                      <span className="text-green-600 font-semibold">Disponible</span>
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
                        className="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-blue-600">
                        {horasSeleccionadas.includes(hora.hora) ? 'Quitar' : 'Seleccionar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                  className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition-transform transform hover:scale-105 w-full md:w-auto">
                  Proceder al pago
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-xl">
            <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-800 dark:text-white">
              Resumen de tu reserva
            </h2>
            <div className="space-y-3 text-gray-800 dark:text-gray-300">
              <p>
                <strong>Monitor:</strong> {instructorSeleccionado?.usuario.nombre}
              </p>
              <p>
                <strong>Fecha:</strong> {fechaSeleccionada}
              </p>
              <p>
                <strong>Horas seleccionadas:</strong> {horasSeleccionadas.join(', ')}
              </p>
              <p>
                <strong>Precio total:</strong> {precioTotal}€
              </p>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button
                onClick={confirmarReserva}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold shadow">
                Pagar y Reservar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
