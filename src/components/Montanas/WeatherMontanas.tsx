import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Montania = {
  id: number;
  nombre: string;
  ubicacion: string;
  altura: number;
  descripcion?: string;
  imagen: string;
};



export default function WeatherMontanas({ montana }: { montana: Montania | null }) {
  

  return (
    <section className="w-full min-h-screen px-6 py-10">
      
    </section>
  );
}
