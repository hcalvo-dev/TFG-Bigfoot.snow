import { Tag, ToggleLeft, Euro, Store } from 'lucide-react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useEffect } from 'react';

type Categoria = { id: number; nombre: string };
type Tienda = { id: number; nombre: string };
type Filtros = {
  categoria: string;
  estado: string;
  precio: string;
  tienda: string;
};

export default function FiltrosVerticales({
  categorias,
  tiendas,
  filtros,
  total,
  slug,
  onFiltroChange,
}: {
  categorias: Categoria[];
  tiendas: Tienda[];
  filtros: Filtros;
  total: number;
  slug: string;
  onFiltroChange: (f: Filtros) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFiltroChange({ ...filtros, [name]: value });
  };

  const tiendasFiltradas = tiendas.filter((t) => t.nombre.toLowerCase().includes('sierra nevada'));

  return (
    <div className="space-y-8 p-6 bg-white border border-zinc-200 rounded-2xl shadow-xl">
      <div className="flex mb-3 items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-3xl font-blowbrush text-sky-950 uppercase tracking-widest">
          <SlidersHorizontal className="w-7 h-7 text-sky-950" />
          PRODUCTOS
        </h2>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-sky-950" />
          <span className="text-gray-500">
            {total} {total === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>
      {/* Filtro categoría */}
      <div className="flex items-center pt-3 gap-3">
        <Tag className="w-5 h-5 text-sky-950" />
        <select
          name="categoria"
          onChange={handleChange}
          value={filtros.categoria}
          className="flex-1 bg-white border border-zinc-300 text-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950">
          <option value="">Categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro estado */}
      <div className="flex items-center gap-3">
        <ToggleLeft className="w-5 h-5 text-sky-950" />
        <select
          name="estado"
          onChange={handleChange}
          value={filtros.estado}
          className="flex-1 bg-white border border-zinc-300 text-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950">
          <option value="">Estado</option>
          <option value="activo">Con Stock</option>
          <option value="inactivo">Sin stock</option>
        </select>
      </div>

      {/* Filtro precio */}
      <div className="flex items-center gap-3">
        <Euro className="w-5 h-5 text-sky-950" />
        <select
          name="precio"
          onChange={handleChange}
          value={filtros.precio}
          className="flex-1 bg-white border border-zinc-300 text-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950">
          <option value="">Precio</option>
          <option value="0-50">€0 - €50</option>
          <option value="50-100">€50 - €100</option>
          <option value="100+">€100+</option>
        </select>
      </div>

      {/* Filtro tienda */}
      <div className="flex pb-3 items-center gap-3">
        <Store className="w-5 h-5 text-sky-950" />
        <select
          name="tienda"
          onChange={handleChange}
          value={filtros.tienda}
          className="flex-1 bg-white border border-zinc-300 text-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950">
          <option value="">Tienda</option>
          {tiendas.map((t) => (
            <option key={t.id} value={t.nombre}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
