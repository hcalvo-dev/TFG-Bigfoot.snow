'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Euro, Percent, Truck, BadgePercent } from 'lucide-react';
import ReservaCard from './ReservaCard';

export default function CarritoProductos() {
  const [subtotal, setSubtotal] = useState(80.96);
  const [descuento, setDescuento] = useState(0.2);
  const [envioGratis, setEnvioGratis] = useState(true);
  const [impuestos, setImpuestos] = useState(14.0);
  const [csrfToken, setCsrfToken] = useState('');
  const total = subtotal - subtotal * descuento + (envioGratis ? 0 : 9.99) + impuestos;
  const [reservas, setReservas] = useState([]);

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

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setReservas(data.reservas);
      } catch {
        console.error('❌ Error al parsear JSON de reservas:', text);
      }
    } catch (err) {
      console.error('❌ Error al hacer fetch de reservas:', err);
    }
  };

  useEffect(() => {
    if (csrfToken) fetchReservas();
  }, [csrfToken]);

  return (
    <div className="flex flex-col-reverse mt-18 xl:flex-row gap-10 p-4 sm:p-6 w-[95%] mx-auto">
      {/* Productos */}
      <div className="flex-1 w-full space-y-4">
        {reservas.length === 0 ? (
          <p className="text-2xl text-sky-950 font-blowbrush tracking-widest font-bold uppercase text-center italic">
            Aun no hay productos...
          </p>
        ) : (
          reservas.map((reserva, i) => <ReservaCard key={i} reserva={reserva} actualizarReservas={fetchReservas} csrfToken={csrfToken} />)
        )}
      </div>

      {/* Aside derecho: resumen del pedido */}
      <aside className="w-full xl:max-w-[28%] h-[75vh] bg-white border border-zinc-200 rounded-2xl shadow-xl p-6 space-y-6 top-6">
        <div>
          <h2 className="text-3xl font-blowbrush text-sky-950 uppercase tracking-widest mb-4">
            Carrito
          </h2>

          {/* Opciones de envío */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-gray-800">
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-950" />
                Envío estándar
              </span>
              <span className="text-sm font-medium">{envioGratis ? 'Gratis' : '9.99€'}</span>
            </div>

            <div className="flex justify-between items-center text-gray-800">
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-950" />
                Envío exprés
              </span>
              <span className="text-sm">9.99€</span>
            </div>
          </div>
        </div>

        {/* Código promocional */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <BadgePercent className="w-5 h-5 text-sky-950" />
            Código promocional
          </label>
          <div className="flex">
            <input
              type="text"
              className="flex-1 border border-zinc-300 rounded-l-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-950"
              placeholder="Introduce tu código"
            />
            <button className="bg-sky-950 text-white px-4 rounded-r-lg text-sm hover:bg-sky-800 transition">
              Aplicar
            </button>
          </div>
        </div>

        {/* Detalles del total */}
        <div className="border-t border-zinc-200 pt-4 space-y-2 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Descuento
            </span>
            <span>-{(subtotal * descuento).toFixed(2)} €</span>
          </div>
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
          <button className="w-full bg-sky-950 hover:bg-sky-800 transition text-white py-3 rounded-lg font-bold">
            Proceder al pago
          </button>
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold">
            Seguir comprando
          </button>
        </div>
      </aside>
    </div>
  );
}
