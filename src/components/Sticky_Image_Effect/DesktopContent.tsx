import { motion, MotionValue } from 'framer-motion';
import { CableCar, Backpack , SunSnow } from 'lucide-react';
import TiltImageBlock from './TiltImageBlock';
import { useState } from 'react';

const navLinks = [
  { id: 'forfait', label: 'Forfait', href: '/equipos?categoria=forfait', Icon: CableCar, ariaLabel: 'Redirección a la página de forfait' },
  { id: 'equipos', label: 'Equipos', href: '/equipos?equipos', Icon: Backpack, ariaLabel: 'Redirección a la página de Tienda' },
  { id: 'weather', label: 'Montañas', href: '/montanas', Icon: SunSnow, ariaLabel: 'Redirección a la página de montañas' },
];

type Props = {
  dividerOpacity: MotionValue<number>;
  logosOpacity: MotionValue<number>;
  iconsOpacity: MotionValue<number>;
  rombosOpacity: MotionValue<number>;
};

export default function DesktopContent({
  dividerOpacity,
  logosOpacity,
  iconsOpacity,
  rombosOpacity,
}: Props) {
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent, label: string) => {
    setTooltip({ label, x: e.clientX + 15, y: e.clientY + 15 });
  };

  return (
    <motion.div
      className="relative w-full min-h-[300vh] hidden md:flex flex-col items-center"
      style={{ opacity: dividerOpacity }}
      onMouseLeave={() => setTooltip(null)}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="relative flex flex-col items-center justify-start h-full">

          {/* Puntos y línea */}
          <div className="relative flex flex-col items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-black mt-1" />
            <div className="w-3.5 h-3.5 rounded-full bg-black mt-1 -mb-3" />
          </div>
          <div className="w-[4px] bg-black flex-1" />

          {/* Logo en el centro */}
          {[{ top: '20%' }, { top: '40%' }, { top: '60%' }, { top: '80%' }].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-18 md:h-18 xl:w-20 xl:h-20 rounded-full bg-white flex items-center justify-center shadow-md"
              style={{ top: pos.top, opacity: logosOpacity }}>
              {i === 0 && (
                <img
                  src="/img/logo_1.svg"
                  alt="Logo de Bigfoot"
                  className="md:w-14 md:h-14 xl:w-18 xl:h-18"
                />
              )}
            </motion.div>
          ))}

          {/* Iconos con tooltip */}
          {navLinks.map(({ id, label, href, Icon, ariaLabel }, i) => (
            <div
              key={id}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${40 + i * 20}%` }}
              onMouseMove={(e) => handleMouseMove(e, label)}
              onMouseLeave={() => setTooltip(null)}>
              <motion.a
                href={href}
                aria-label={ariaLabel}
                whileHover={{ scale: 1.1 }}
                className="origin-center md:w-18 md:h-18 xl:w-20 xl:h-20 rounded-full bg-white hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center shadow-md group"
                style={{ opacity: iconsOpacity }}>
                <Icon className="text-gray-600 group-hover:text-white transition-colors duration-300 w-10 h-10 md:w-10 md:h-10 xl:w-12 xl:h-12" />
              </motion.a>
            </div>
          ))}

          {/* Línea final */}
          <div className="flex flex-col items-center gap-1 mb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-black -mt-3" />
            <div className="w-2.5 h-2.5 rounded-full bg-black mt-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1" />
          </div>
        </div>

        {/* Tilt blocks → enlaces directos */}
        <motion.a
          className="absolute rotate-[-12deg] top-1/2 left-[12.5%] -translate-y-1/2 cursor-pointer"
          href="/equipos?categoria=snowboard"
          aria-label='Redirección a la página de equipos de snowboard'
          style={{ opacity: rombosOpacity }}>
          <TiltImageBlock text="SNOWBOARD" alt="Hombre trasportando una tabla de snowboard" image="/img/index/snowboard.webp" />
        </motion.a>

        <motion.a
          className="absolute rotate-[12deg] top-1/2 right-[12.5%] -translate-y-1/2 cursor-pointer"
          href="/equipos?categoria=esquí"
          aria-label='Redirección a la página de equipos de esquí'
          style={{ opacity: rombosOpacity }}>
          <TiltImageBlock text="SKII" alt="Persona haciendo skii sobre la nieve" image="/img/index/skii.webp" />
        </motion.a>

        {/* Tooltip flotante */}
        {tooltip && (
          <div
            className="fixed z-50 px-3 py-1 text-sm bg-black text-white rounded-md shadow-lg pointer-events-none transition"
            style={{ top: tooltip.y, left: tooltip.x }}>
            {tooltip.label}
          </div>
        )}
      </div>
    </motion.div>
  );
}
