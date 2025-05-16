import { ContainerTextFlip } from '../ui/container-text-flip';

export default function ServicesContent() {
  const words = ['Alquiler de material', 'Forfaits', 'Reserva de clases', 'Montañas'];

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Invisible reference layer */}
      <div className="opacity-0 pointer-events-none absolute">
        <div className="text-3xl font-bold whitespace-nowrap">
          {words.reduce((longest, word) => word.length > longest.length ? word : longest, '')}
        </div>
      </div>

      {/* Animated flip content */}
      <div className="relative">
        <ContainerTextFlip
          words={words}
          interval={4000}
          className="text-3xl font-bold text-white mb-4 whitespace-nowrap"
          textClassName="flex items-center justify-center text-3xl font-bold text-white"
          animationDuration={1000}
        />
      </div>
    </div>
  );
}
