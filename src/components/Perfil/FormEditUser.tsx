import { useState } from 'react';

type Props = {
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
  csrfToken: string;
};

export default function FormularioEdicionUsuario({ usuario, csrfToken }: Props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre: nombre || usuario.nombre,
          email: email || usuario.email,
          password: password || undefined,
        }),
      });

      const data = await res.json();
      setMensaje(data.message || 'Datos actualizados correctamente');
    } catch (err) {
      setMensaje('Error al actualizar los datos');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
      <div>
        <label className="block text-16 font-extrabold tracking-widest text-sky-950">NUEVO NOMBRE</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={usuario.nombre}
          className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20"
        />
      </div>
      <div>
        <label className="block text-16 font-extrabold tracking-widest text-sky-950">NUEVO EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={usuario.email}
          className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20"
        />
      </div>
      <div>
        <label className="block text-16 font-extrabold tracking-widest text-sky-950">NUEVA CONTRASEÑA</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Guardar cambios
      </button>

      {mensaje && <p className="text-green-400 mt-2">{mensaje}</p>}
    </form>
  );
}
