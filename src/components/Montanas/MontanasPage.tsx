import { useState } from 'react';
import MontanasInteractive from './MontanasImgPortada';
import RutasMontanas from './RutasMontanas';
import WeatherMontanas from './WeatherMontanas';

type Montania = {
  id: number;
  nombre: string;
  ubicacion: string;
  altura: number;
  descripcion?: string;
  imagen: string;
};


export default function MontanasPage() {
  const [seleccionada, setSeleccionada] = useState<Montania | null>(null);

  return (
    <>
      <section id="contenido" className="relative w-full">
        <MontanasInteractive onSeleccion={setSeleccionada} />
      </section>

      <section id="contenido" className="relative w-full ">
        <RutasMontanas montana={seleccionada} />
      </section>

       <section id="contenido" className="relative w-full">
        <WeatherMontanas montana={seleccionada} />
      </section>
    </>
  );
}
