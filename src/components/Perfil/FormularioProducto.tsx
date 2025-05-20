'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const schema = z.object({
  nombre: z.string().min(3, 'Debe tener al menos 3 caracteres'),
  descripcion: z
    .string()
    .min(30, 'Debe tener al menos 30 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  precioDia: z.coerce.number().min(1, 'Precio mínimo 1€'),
  stockTotal: z.coerce.number().int().min(1, 'Debe haber al menos 1 en stock'),
  categoriaId: z.coerce.number(),
  tiendaId: z.coerce.number(),
  tallas: z.union([z.string(), z.array(z.string())]).optional(),
  medidas: z.union([z.string(), z.array(z.string())]).optional(),
});

type Producto = {
  id?: number;
  nombre: string;
  descripcion?: string;
  precioDia: number;
  imagenUrl?: string;
  stockTotal: number;
  categoria?: { id: number; nombre: string };
  tienda?: { id: number; nombre: string };
  tallas?: string[];
  medidas?: string[];
};

type Categoria = { id: number; nombre: string };
type Tienda = { id: number; nombre: string };

type Props = {
  producto?: Producto;
  categorias: Categoria[];
  tiendas: Tienda[];
  csrfToken: string;
  onSuccess: () => void;
};

export default function FormularioProducto({
  producto,
  categorias,
  tiendas,
  csrfToken,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: producto?.nombre || '',
      descripcion: producto?.descripcion || '',
      precioDia: producto?.precioDia || 0,
      stockTotal: producto?.stockTotal || 0,
      categoriaId: producto?.categoria?.id || categorias[0]?.id,
      tiendaId: producto?.tienda?.id || tiendas[0]?.id,
      tallas: producto?.tallas || [],
      medidas: producto?.medidas || [],
    },
  });

  const descripcionValue = useWatch({ name: 'descripcion', control });
  const categoriaIdSeleccionada = watch('categoriaId');

  const [categoriaNombre, setCategoriaNombre] = useState<string | undefined>(
    producto?.categoria?.nombre
  );

  useEffect(() => {
    const cat = categorias.find((c) => c.id === Number(categoriaIdSeleccionada));
    setCategoriaNombre(cat?.nombre);
  }, [categoriaIdSeleccionada, categorias]);

  const mostrarTallas = categoriaNombre && !['Snowboard', 'Esquí'].includes(categoriaNombre);
  const mostrarMedidas = categoriaNombre && ['Snowboard', 'Esquí'].includes(categoriaNombre);

console.log('categoriaNombre', categoriaNombre);
  console.log('categoriaIdSeleccionada', categoriaIdSeleccionada);
  console.log('mostrarTallas', mostrarTallas);
  console.log('mostrarMedidas', mostrarMedidas);

  const onSubmit = async (data: any) => {
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
      body: JSON.stringify(producto ? { id: producto.id, ...data } : data),
    });

    if (res.ok) {
      onSuccess();
      reset();
    }
  };

  return (
    <div className="pt-4">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 text-sm">
        <div>
          <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
            NOMBRE
          </label>
          <input
            {...register('nombre')}
            placeholder="Nombre del producto"
            className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.nombre ? 'border-red-500' : ''
            }`}
          />
          {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
            DESCRIPCIÓN
          </label>
          <textarea
            {...register('descripcion')}
            rows={3}
            maxLength={200}
            className={`w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.descripcion ? 'border-red-500' : ''
            }`}
            placeholder="Descripción breve del producto"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>{descripcionValue?.length || 0}/200 caracteres</span>
            {errors.descripcion && (
              <span className="text-red-400">{errors.descripcion.message}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
            PRECIO/DÍA (€)
          </label>
          <input
            {...register('precioDia')}
            type="number"
            className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.precioDia ? 'border-red-500' : ''
            }`}
          />
          {errors.precioDia && (
            <p className="text-red-400 text-sm mt-1">{errors.precioDia.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
            STOCK TOTAL
          </label>
          <input
            {...register('stockTotal')}
            type="number"
            className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.stockTotal ? 'border-red-500' : ''
            }`}
          />
          {errors.stockTotal && (
            <p className="text-red-400 text-sm mt-1">{errors.stockTotal.message}</p>
          )}
        </div>

        {!producto && (
          <>
            <div>
              <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
                CATEGORÍA
              </label>
              <select
                {...register('categoriaId')}
                className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.categoriaId ? 'border-red-500' : ''
                }`}>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="text-red-400 text-sm mt-1">{errors.categoriaId.message}</p>
              )}
            </div>

            <div>
              <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
                TIENDA
              </label>
              <select
                {...register('tiendaId')}
                className={`w-full p-2 rounded bg-[#1f2937] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500`}>
                {tiendas.map((tienda) => (
                  <option key={tienda.id} value={tienda.id}>
                    {tienda.nombre}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {mostrarTallas && (
          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              TALLAS
            </label>
            <input
              {...register('tallas')}
              defaultValue={producto?.tallas?.join(',') || ''}
              placeholder="Ej: S,M,L"
              className="w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}

        {mostrarMedidas && (
          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              MEDIDAS
            </label>
            <input
              {...register('medidas')}
              defaultValue={producto?.medidas?.join(',') || ''}
              placeholder="Ej: 151:31, 152:32"
              className="w-full p-2 rounded bg-[#1f2937] text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}

        <div className="w-full flex justify-center mt-2">
          <motion.button
            layout
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md shadow-black/40 w-full"
            whileTap={{ scale: 0.95 }}>
            {producto ? 'Actualizar' : 'Crear'} Producto
          </motion.button>
        </div>
      </form>
    </div>
  );
}
