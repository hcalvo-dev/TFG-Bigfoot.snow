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

export const comprobarDescuento = async (req, res) => {
  const { codigo, total, tipo, cantidadProductos } = req.body;
  try {
    const descuento = await prisma.descuento.findUnique({
      where: { codigo },
    });

    if (!descuento) {
      return res.status(404).json({ error: 'Código de descuento no disponible' });
    }

    if (!descuento.activo) {
      return res.status(400).json({ error: 'Código de descuento no disponible' });
    }

    if (descuento.fechaValidez < new Date()) {
      return res.status(400).json({ error: 'Código de descuento expirado' });
    }

    if (total <= 0) {
      return res.status(400).json({ error: 'Debes reservar algo para usar este código' });
    }

    // Validar si aplica al tipo
    if (descuento.aplicaEn !== tipo && descuento.aplicaEn !== 'AMBOS') {
      return res.status(400).json({ error: 'Este código no se aplica a este tipo de reserva' });
    }

    // Reglas específicas por código
    if (codigo === 'WELCOME5' && total < 100) {
      return res.status(400).json({ error: 'Este código requiere un mínimo de 100€' });
    }

    if (codigo === 'SNOWFREAK15' && (!cantidadProductos || cantidadProductos < 3)) {
      return res
        .status(400)
        .json({ error: 'Debes reservar al menos 3 productos para usar este código' });
    }

    // Si pasa todo
    return res.status(200).json({ descuento });
  } catch (err) {
    console.error('❌ Error al comprobar descuento:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
