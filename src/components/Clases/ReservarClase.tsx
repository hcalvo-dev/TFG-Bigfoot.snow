import { useEffect, useState, useRef  } from 'react';
import { motion } from 'framer-motion';

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
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const tablaRef = useRef<HTMLDivElement | null>(null);
  
  const nivelActivo = niveles.find(n => n.id.toString() === nivelSeleccionado);

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
      .then(res => res.json())
      .then(data => setMontanas(data))
      .catch(err => console.error('Error al cargar montañas:', err));

    fetch('http://localhost:4000/api/nivel/all', {
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken },
    })
      .then(res => res.json())
      .then(data => setNiveles(data))
      .catch(err => console.error('Error al cargar niveles:', err));
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
        .then(res => res.json())
        .then(data => {
          setInstructores(data);
          setInstructorSeleccionado(null);
          setMensaje(data.length === 0 ? 'No hay instructores disponibles.' : '');
        })
        .catch(err => console.error('Error al obtener instructores:', err));
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
        .then(res => res.json())
        .then(data => setHorasDisponibles(data))
        .catch(err => console.error('Error al obtener horarios:', err));
    }
  }, [instructorSeleccionado, fechaSeleccionada]);

  const reservar = () => {
    if (montanaId && especialidad && fechaSeleccionada && horaSeleccionada) {
      fetch('/api/reservar-clase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ montanaId, especialidad, fecha: fechaSeleccionada, hora: horaSeleccionada }),
      })
        .then(res => res.json())
        .then(data => setMensaje(data.message || 'Clase reservada con éxito.'));
    }
  };

  return (
    <section className="min-h-[50vh] px-6 py-16 ">
      <div className="max-w-3xl mt-4 mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-sky-950 mb-4">¿Quieres iniciarte en la práctica del <br></br> Skii o Snowboard?</h1>
        <p className="text-gray-600 leading-relaxed">
          ¿Te apetece mejorar tu técnica? En <strong>Bigfoot</strong> te lo ponemos fácil: disfruta aprendiendo al máximo en nuestras pistas,
          sin colas y con clases que se convertirán en una experiencia inolvidable.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
        <select onChange={(e) => setMontanaId(e.target.value)} defaultValue="" className="p-3 rounded-xl border-2 border-blue-400 shadow">
          <option value="" disabled>Elige tu estación</option>
          {montanas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
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

        <select onChange={(e) => setEspecialidad(e.target.value)} defaultValue="" className="p-3 rounded-xl border-2 border-blue-400 shadow">
          <option value="" disabled>Especialidad</option>
          <option value="skii">Skii</option>
          <option value="snowboard">Snowboard</option>
        </select>

        <select
          value={nivelSeleccionado}
          onChange={(e) => setNivelSeleccionado(e.target.value)}
          className="p-3 rounded-xl border-2 border-blue-400 shadow"
        >
          <option value="" disabled>Elige tu nivel</option>
          {niveles.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>

      {mensaje && <p className="text-center text-red-500 font-semibold mb-8">{mensaje}</p>}

      {instructores.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {instructores.map(instr => (
            <div
              key={instr.id}
              onClick={() => {
                setInstructorSeleccionado(instr);
                setTimeout(() => {
                  if (tablaRef.current) {
                    const offsetTop = tablaRef.current.getBoundingClientRect().top + window.pageYOffset;
                    const headerOffset = 250;
                    window.scrollTo({ top: offsetTop - headerOffset, behavior: 'smooth' });
                  }
                }, 100);
              }}
              className={`cursor-pointer rounded-xl overflow-hidden shadow group transition-transform duration-200 hover:scale-105 ${
                instructorSeleccionado?.id === instr.id ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              <img
                src={instr.fotoUrl}
                alt={instr.usuario.nombre}
                className={`w-full h-48 object-cover transition duration-300 ${
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
        <div ref={tablaRef} className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="w-4 p-4 text-left align-middle">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900 whitespace-nowrap dark:text-blue-200">
                      {instructorSeleccionado?.usuario.nombre ?? ''}
                    </span>
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="w-4 h-4 mt-1 text-blue-600 hidden bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      disabled
                    />
                  </div>
                </th>
                <th className="px-8 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Hora</th>
                <th className="px-8 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Estado</th>
                <th className="px-8 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Precio</th>
                <th className="px-8 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Acción</th>
              </tr>
            </thead>
            <tbody>
              {horasDisponibles.map((hora, index) => (
                <tr key={index} className="bg-white scroll-mt-[100px] border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-${index}`}
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        disabled={!hora.disponible}
                      />
                      <label htmlFor={`checkbox-${index}`} className="sr-only">Seleccionar hora</label>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {hora.hora}
                    {fechaSeleccionada && (
                      <>
                      {' '}
                        -{' '}
                        {(() => {
                          const date = new Date(fechaSeleccionada);
                          const dias = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'];
                          const letraDia = dias[date.getDay()];
                          const dia = String(date.getDate()).padStart(2, '0');
                          const mes = String(date.getMonth() + 1).padStart(2, '0');
                          const anio = date.getFullYear();
                          return `${letraDia} - ${dia}-${mes}-${anio}`;
                        })()}
                      </>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    {hora.disponible
                      ? <span className="text-green-600 font-semibold">Disponible</span>
                      : <span className="text-red-500 font-semibold">Ocupada</span>
                    }
                  </td>
                  <td className="px-8 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{nivelActivo?.precio ?? '-'}€</td>
                  <td className="px-8 py-4">
                    {hora.disponible ? (
                      <button
                        onClick={() => {
                          setHoraSeleccionada(hora.hora);
                          reservar();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded shadow"
                      >
                        Reservar
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">Pronto más huecos 😉</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}