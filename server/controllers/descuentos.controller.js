import prisma from '../../src/lib/prisma';

export const getAllDescuentos = async (req, res) => {
  try {
    const descuentos = await prisma.descuento.findMany({
      where: {
        activo: true,
      },
    });

    res.json(descuentos);
  } catch (error) {
    console.error('💥 Error inesperado al obtener descuentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllDescuentosEstados = async (req, res) => {
  try {
    const descuentos = await prisma.descuento.findMany({
      orderBy: {
        codigo: 'asc',
      },
    });

    console.log(descuentos);

    res.json(descuentos);
  } catch (error) {
    console.error('💥 Error inesperado al obtener descuentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteDescuentos = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedDescuento = await prisma.descuento.update({
      where: { id },
      data: { activo: false },
    });

    res.json({ message: 'Descuento eliminado', deletedDescuento });
  } catch (error) {
    console.error('💥 Error inesperado al eliminar descuento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const activarDescuentos = async (req, res) => {
  try {
    const { id } = req.body;

    const updatedDescuento = await prisma.descuento.update({
      where: { id },
      data: { activo: true },
    });

    res.json({ message: 'Descuento activado', updatedDescuento });
  } catch (error) {
    console.error('💥 Error inesperado al activar descuento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const editDescuentos = async (req, res) => {
  const { id, codigo, descripcion, porcentaje, aplicaEn, fechaValidez } = req.body;

  const opcionesValidas = ['PRODUCTOS', 'CLASES', 'AMBOS'];
  if (!opcionesValidas.includes(aplicaEn)) {
    return res.status(400).json({ error: 'Valor inválido para aplicaEn' });
  }

  try {
    const actualizado = await prisma.descuento.update({
      where: { id: Number(id) },
      data: {
        codigo,
        descripcion,
        porcentaje: Number(porcentaje),
        aplicaEn,
        fechaValidez: new Date(fechaValidez),
      },
    });

    return res.status(200).json(actualizado);
  } catch (err) {
    console.error('❌ Error al actualizar descuento:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createDescuentos = async (req, res) => {
  const { codigo, descripcion, porcentaje, aplicaEn, fechaValidez } = req.body;

  const opcionesValidas = ['PRODUCTOS', 'CLASES', 'AMBOS'];
  if (!opcionesValidas.includes(aplicaEn)) {
    return res.status(400).json({ error: 'Valor inválido para aplicaEn' });
  }

  try {
    const nuevo = await prisma.descuento.create({
      data: {
        codigo,
        descripcion,
        porcentaje: Number(porcentaje),
        aplicaEn,
        fechaValidez: new Date(fechaValidez),
        activo: true,
      },
    });

    return res.status(201).json(nuevo);
  } catch (err) {
    console.error('❌ Error al crear descuento:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
