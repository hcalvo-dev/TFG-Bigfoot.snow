import prisma from '../../src/lib/prisma';
const { parseISO, eachDayOfInterval } = require('date-fns');
export const getAllProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categorias: {
          select: {
            id: true,
            nombre: true,
          },
        },
        tienda: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    if (!productos.length) {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }

    res.json(productos);
  } catch (error) {
    console.error('Error en getAllProductos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const createProductos = async (req, res) => {
  try {

    console.log('📦 BODY:', req.body);
    console.log('🖼️ FILE:', req.file);

    const {
      nombre,
      descripcion,
      precioDia,
      stockTotal,
      categoriaId,
      tiendaId,
      tallas,
      medidas,
    } = req.body;

    const imagen = req.file;

    if (!imagen) {
      return res.status(400).json({ error: 'La imagen es obligatoria' });
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precioDia: parseFloat(precioDia),
        stockTotal: parseInt(stockTotal),
        estado: 'activo',
        imagenUrl: `/uploads/productos/${imagen.filename}`,
        tallas: JSON.parse(tallas),
        medidas: JSON.parse(medidas),
        ubicacion: "almacen1",
        categorias: {
          connect: { id: Number(categoriaId) },
        },
        tienda: {
          connect: { id: Number(tiendaId) },
        },
      },
    });

    res.status(201).json({ message: 'Producto creado', producto });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

export const editProductos = async (req, res) => {
  try {
    console.log('--- Editando producto ---');
    console.log('BODY recibido:', req.body);

    const {
      id,
      nombre,
      descripcion,
      precioDia,
      stockTotal,
      categoriaId,
      tiendaId,
      tallas,
      medidas,
    } = req.body;

    console.log('ID:', id);
    console.log('Nombre:', nombre);
    console.log('Descripción:', descripcion);
    console.log('Precio/Día:', precioDia);
    console.log('Stock total:', stockTotal);
    console.log('Categoría ID:', categoriaId);
    console.log('Tienda ID:', tiendaId);
    console.log('Tallas:', tallas);
    console.log('Medidas:', medidas);

    const tallasProcesadas =
      typeof tallas === 'string'
        ? tallas.split(',').map((t) => t.trim().toUpperCase())
        : tallas?.map((t) => t.toUpperCase());

    const medidasProcesadas =
      typeof medidas === 'string' ? medidas.split(',').map((m) => m.trim()) : medidas;

    console.log('Tallas procesadas:', tallasProcesadas);
    console.log('Medidas procesadas:', medidasProcesadas);

    const dataUpdate = {
      nombre,
      descripcion,
      precioDia: parseFloat(precioDia),
      stockTotal: parseInt(stockTotal),
      tallas: tallasProcesadas,
      medidas: medidasProcesadas,
      categorias: {
        set: [{ id: Number(categoriaId) }],
      },
      tienda: {
        connect: { id: Number(tiendaId) },
      },
    };

    console.log('Data final para update:', dataUpdate);

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data: dataUpdate,
    });

    console.log('Producto actualizado correctamente:', producto);
    res.status(200).json({ message: 'Producto actualizado', producto });

  } catch (error) {
    console.error('❌ Error editando producto:', error);
    res.status(500).json({ error: 'Error al editar producto' });
  }
};

export const desactivarProductos = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID de producto no proporcionado' });
    }
    console.log(' id: ', id);

    const producto = await prisma.producto.update({
      where: { id },
      data: { estado: 'inactivo' },
    });

    res.json({ message: 'Producto desactivado', producto });
  } catch (error) {
    console.error('Error en desactivarProductos:', error);
    res.status(500).json({ error: 'Error al desactivar producto' });
  }
};

export const activarProductos = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID de producto no proporcionado' });
    }

    const producto = await prisma.producto.update({
      where: { id },
      data: { estado: 'activo' },
    });

    res.json({ message: 'Producto activado', producto });
  } catch (error) {
    console.error('Error en activarProductos:', error);
    res.status(500).json({ error: 'Error al activar producto' });
  }
};

export const productosDisponibles = async (req, res) => {
  const { fechaInicio, fechaFin } = req.body;

  console.log('Fechas recibidas:', fechaInicio, fechaFin);
  if (!fechaInicio || !fechaFin ) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const inicio = parseISO(fechaInicio);
  const fin = parseISO(fechaFin);

  if (inicio > fin) {
    return res.status(400).json({ error: 'Fechas no válidas' });
  }

  const dias = eachDayOfInterval({ start: inicio, end: fin });

  try {

    const productos = await prisma.producto.findMany({
      where: {
        estado: 'activo',
      },
      include: {
        categorias: true,
        tienda: true,
        disponibilidad: true,
        reservas: {
          include: {
            reserva: true,
          },
        },
      },
    });

    const disponibles = productos.filter((producto) => {
      return dias.every((dia) => {
        const fechaActual = dia.toISOString().split('T')[0];

        const disponibilidadDia = producto.disponibilidad.find(
          (d) => d.fecha.toISOString().split('T')[0] === fechaActual
        );

        const stockDisponible = disponibilidadDia
          ? disponibilidadDia.cantidadDisponible
          : producto.stockTotal;

        const reservasEseDia = producto.reservas.filter((r) => {
          const inicioRes = new Date(r.reserva.fechaInicio);
          const finRes = new Date(r.reserva.fechaFin);

          return (
            new Date(fechaActual) >= new Date(inicioRes.toDateString()) &&
            new Date(fechaActual) <= new Date(finRes.toDateString())
          );
        });

        const totalReservado = reservasEseDia.reduce((acc, r) => acc + r.cantidad, 0);

        return totalReservado < stockDisponible;
      });
    });

    return res.json(disponibles);
  } catch (err) {
    console.error('Error al obtener disponibilidad de productos:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

