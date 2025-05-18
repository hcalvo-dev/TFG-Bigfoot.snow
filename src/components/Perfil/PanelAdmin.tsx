import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

type Usuario = { id: number; nombre: string; email: string; rol: string };

type Props = {
  usuario: Usuario;
  csrfToken: string;
  onUpdateSuccess: () => void;
};

export default function PanelAdmin({ usuario, csrfToken, onUpdateSuccess }: Props) {
  return (
    <div className="relative">
          <div className="rounded-xl text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <h2 className="text-xl font-extrabold font-blowbrush tracking-widest text-sky-950 uppercase">
                Panel de gestión
              </h2>
            </div>
        </div>
    </div>
  );
}
