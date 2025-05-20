import prisma from '../../src/lib/prisma';

export const getAllProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categorias: {
          select: {
            id: true,
            nombre: true
          }
        },
        tienda: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
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

export const editProductos = async (req, res) => {};

export const desactivarProductos = async (req, res) => {
    try {
        const { id } = req.body;
    
        if (!id) {
        return res.status(400).json({ message: 'ID de producto no proporcionado' });
        }
        console.log(" id: ",id);
    
        const producto = await prisma.producto.update({
        where: { id },
        data: { estado: "inactivo" }
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
        data: { estado: "activo" }
        });
    
        res.json({ message: 'Producto activado', producto });
    } catch (error) {
        console.error('Error en activarProductos:', error);
        res.status(500).json({ error: 'Error al activar producto' });
    }
};