'use client';

import { useState } from 'react';

type Producto = {
  id?: number;
  nombre: string;
  descripcion?: string;
  precioDia: number;
  estado: string;
  imagenUrl?: string;
  stockTotal: number;
  categoria?: { id: number; nombre: string };
};

type Categoria = {
  id: number;
  nombre: string;
};

type Props = {
  producto?: Producto;
  categorias: Categoria[];
  csrfToken: string;
  onSuccess: () => void;
};

export default function FormularioProducto({ producto, categorias, csrfToken, onSuccess }: Props) {
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [precioDia, setPrecioDia] = useState(producto?.precioDia || 0);
  const [stockTotal, setStockTotal] = useState(producto?.stockTotal || 0);
  const [estado, setEstado] = useState(producto?.estado || 'activo');
  const [categoriaId, setCategoriaId] = useState(producto?.categoria?.id || categorias[0]?.id);

  const handleSubmit = async () => {
    const body = { nombre, precioDia, stockTotal, estado, categoriaId };
    const url = producto
      ? 'http://localhost:4000/api/productos/edit'
      : 'http://localhost:4000/api/productos/creates';

    const res = await fetch(url, {
      method: producto ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(producto ? { id: producto.id, ...body } : body),
    });

    if (res.ok) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="input" />
      <input value={precioDia} onChange={(e) => setPrecioDia(+e.target.value)} type="number" placeholder="Precio/día" className="input" />
      <input value={stockTotal} onChange={(e) => setStockTotal(+e.target.value)} type="number" placeholder="Stock total" className="input" />

      <select value={estado} onChange={(e) => setEstado(e.target.value)} className="input">
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>

      <select value={categoriaId} onChange={(e) => setCategoriaId(+e.target.value)} className="input">
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>

      <button onClick={handleSubmit} className="btn-primary">
        {producto ? 'Actualizar' : 'Crear'}
      </button>
    </div>
  );
}
