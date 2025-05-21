import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const useProductoSchema = (categorias: Categoria[]) => {
  return useMemo(() => {
    return z
      .object({
        nombre: z.string().min(3, 'Debe tener al menos 3 caracteres'),
        descripcion: z.string().min(100, 'Debe tener al menos 100 caracteres').max(200),
        precioDia: z.coerce.number().min(10, 'Precio mínimo 10€'),
        stockTotal: z.coerce.number().int().min(10, 'Debe haber al menos 10 en stock'),
        categoriaId: z.coerce.number(),
        tiendaId: z.coerce.number(),
        tallas: z
          .union([z.string(), z.array(z.string())])
          .transform((val) =>
            (typeof val === 'string' ? val.split(',') : val)
              .map((s) => s.trim().toUpperCase())
              .filter(Boolean)
          ),
        medidas: z
          .union([z.string(), z.array(z.string())])
          .transform((val) =>
            (typeof val === 'string' ? val.split(',') : val).map((s) => s.trim()).filter(Boolean)
          ),
        imagen: z.any(), // válida solo para creación luego
      })
      .superRefine((data, ctx) => {
        const categoria = categorias.find((c) => c.id === data.categoriaId);
        const nombre = categoria?.nombre ?? '';

        const usaTallas = !['Snowboard', 'Esquí'].includes(nombre);
        const usaMedidas = ['Snowboard', 'Esquí'].includes(nombre);

        if (usaTallas) {
          const TALLAS_VALIDAS = ['S', 'M', 'L', 'X', 'XL'];
          const tallas = data.tallas;

          if (tallas.length === 0) {
            ctx.addIssue({
              path: ['tallas'],
              code: z.ZodIssueCode.custom,
              message: 'Debes seleccionar al menos una talla',
            });
          } else {
            const unicas = new Set(tallas);
            const ordenCorrecto = [...tallas].sort(
              (a, b) => TALLAS_VALIDAS.indexOf(a) - TALLAS_VALIDAS.indexOf(b)
            );

            const todasValidas = tallas.every((t) => TALLAS_VALIDAS.includes(t));
            const sinDuplicados = tallas.length === unicas.size;
            const enOrdenCorrecto = tallas.every((t, i) => t === ordenCorrecto[i]);

            if (!todasValidas) {
              ctx.addIssue({
                path: ['tallas'],
                code: z.ZodIssueCode.custom,
                message: 'Las tallas deben ser S, M, L, X o XL',
              });
            }

            if (!sinDuplicados) {
              ctx.addIssue({
                path: ['tallas'],
                code: z.ZodIssueCode.custom,
                message: 'No se permiten tallas duplicadas',
              });
            }

            if (!enOrdenCorrecto) {
              ctx.addIssue({
                path: ['tallas'],
                code: z.ZodIssueCode.custom,
                message: 'Las tallas deben estar en orden: S, M, L, X, XL',
              });
            }
          }
        }

        if (usaMedidas) {
          if (data.medidas.length === 0) {
            ctx.addIssue({
              path: ['medidas'],
              code: z.ZodIssueCode.custom,
              message: 'Debes seleccionar al menos una medida',
            });
          } else if (!data.medidas.every((m) => /^\d+:\d+$/.test(m))) {
            ctx.addIssue({
              path: ['medidas'],
              code: z.ZodIssueCode.custom,
              message: 'Las medidas deben ser del tipo 151:31',
            });
          }
        }
      });
  }, [categorias]);
};

type Categoria = { id: number; nombre: string };
type Tienda = { id: number; nombre: string };
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
  const schema = useProductoSchema(categorias);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
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
      tallas: producto?.tallas?.join(',') || '',
      medidas: producto?.medidas?.join(',') || '',
      imagen: '',
    },
  });

  const descripcionValue = useWatch({ name: 'descripcion', control });
  const categoriaIdSeleccionada = watch('categoriaId');
  const [categoriaNombre, setCategoriaNombre] = useState(producto?.categoria?.nombre);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const cat = categorias.find((c) => c.id === Number(categoriaIdSeleccionada));
    setCategoriaNombre(cat?.nombre);
  }, [categoriaIdSeleccionada, categorias]);

  const mostrarTallas = categoriaNombre && !['Snowboard', 'Esquí'].includes(categoriaNombre);
  const mostrarMedidas = categoriaNombre && ['Snowboard', 'Esquí'].includes(categoriaNombre);

  const onSubmit = async (data: any) => {
    const url = producto
      ? 'http://localhost:4000/api/productos/edit'
      : 'http://localhost:4000/api/productos/create';

    const headers: HeadersInit = {
      'CSRF-Token': csrfToken,
    };

    let bodyToSend: BodyInit;

    if (producto) {
      headers['Content-Type'] = 'application/json';
      const jsonPayload = {
        ...data,
        id: producto.id,
      };
      bodyToSend = JSON.stringify(jsonPayload);
    } else {
      if (!data.imagen || !(data.imagen[0] instanceof File)) {
        setError('imagen', {
          type: 'manual',
          message: 'Debes subir una imagen válida',
        });
        return;
      }

      if (data.imagen[0].size > 2 * 1024 * 1024) {
        setError('imagen', {
          type: 'manual',
          message: 'La imagen no puede superar los 2MB',
        });
        return;
      }
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('descripcion', data.descripcion);
      formData.append('precioDia', String(data.precioDia));
      formData.append('stockTotal', String(data.stockTotal));
      formData.append('categoriaId', String(data.categoriaId));
      const file = data.imagen instanceof FileList ? data.imagen[0] : null;

      if (!file) {
        setError('imagen', {
          type: 'manual',
          message: 'Debes subir una imagen válida',
        });
        return;
      }

      formData.append('imagen', file);
      formData.append('tiendaId', String(data.tiendaId));
      if (data.tallas) formData.append('tallas', JSON.stringify(data.tallas));
      if (data.medidas) formData.append('medidas', JSON.stringify(data.medidas));

      bodyToSend = formData;
      for (const pair of formData.entries()) {
        console.log(`➡️ ${pair[0]}:`, pair[1]);
      }
    }

    try {
      const res = await fetch(url, {
        method: producto ? 'PATCH' : 'POST',
        headers,
        credentials: 'include',
        body: bodyToSend,
      });

      if (res.ok) {
        onSuccess(); 
        setSuccess(true);
        clearErrors('imagen');
        setTimeout(() => {
          setSuccess(false);
          reset(); 
        }, 2000);
      } else {
        const errorText = await res.text();
        console.error('❌ Error del servidor:', res.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error en el fetch:', error);
    }
  };

  return (
    <div className="pt-4">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 text-sm">
        <div className="col-span-1">
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

        <div className="col-span-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
              PRECIO/DÍA (€)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Ej: 56,88"
              {...register('precioDia', {
                setValueAs: (v) => {
                  if (typeof v === 'string') {
                    const limpio = v.replace(',', '.');
                    const numero = parseFloat(limpio);
                    return isNaN(numero) ? 0 : numero;
                  }
                  return Number(v);
                },
              })}
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
                {errors.tiendaId && (
                  <p className="text-red-400 text-sm mt-1">{errors.tiendaId.message}</p>
                )}
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
              {errors.tallas && (
                <p className="text-red-400 text-sm mt-1">{errors.tallas.message}</p>
              )}
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
              {errors.medidas && (
                <p className="text-red-400 text-sm mt-1">{errors.medidas.message}</p>
              )}
            </div>
          )}

          {!producto && (
            <div>
              <label className="block font-bold font-blowbrush tracking-widest text-sky-950 mb-1">
                IMAGEN
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('imagen')}
                className="w-full p-2 rounded bg-[#1f2937] text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-700 file:text-white hover:file:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {typeof errors.imagen?.message === 'string' && (
                <p className="text-red-400 text-sm mt-1">{errors.imagen.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="w-full flex justify-center mt-2">
          <motion.button
            layout
            type="submit"
            disabled={success}
            className={`${
              success
                ? 'w-14 h-14 rounded-full bg-blue-500 flex justify-center items-center mx-auto'
                : 'bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full shadow-md shadow-black/40'
            }`}
            whileTap={{ scale: 0.95 }}>
            {success ? (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            ) : (
              `${producto ? 'Actualizar' : 'Crear'} Producto`
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
