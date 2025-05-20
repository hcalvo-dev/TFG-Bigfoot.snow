import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedProductos() {

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 1",
      descripcion: "Cascos Modelo 1 de alta calidad.",
      precioDia: 48.4,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-1.webp",
      stockTotal: 7,
      tiendaId: 4,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 2",
      descripcion: "Cascos Modelo 2 de alta calidad.",
      precioDia: 49.84,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-2.webp",
      stockTotal: 2,
      tiendaId: 5,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 3",
      descripcion: "Cascos Modelo 3 de alta calidad.",
      precioDia: 14.54,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-3.webp",
      stockTotal: 2,
      tiendaId: 5,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 4",
      descripcion: "Cascos Modelo 4 de alta calidad.",
      precioDia: 37.35,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-4.webp",
      stockTotal: 8,
      tiendaId: 1,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 5",
      descripcion: "Cascos Modelo 5 de alta calidad.",
      precioDia: 30.71,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-5.webp",
      stockTotal: 10,
      tiendaId: 9,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 6",
      descripcion: "Cascos Modelo 6 de alta calidad.",
      precioDia: 44.03,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-6.webp",
      stockTotal: 1,
      tiendaId: 1,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 7",
      descripcion: "Cascos Modelo 7 de alta calidad.",
      precioDia: 25.39,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-7.webp",
      stockTotal: 10,
      tiendaId: 1,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 8",
      descripcion: "Cascos Modelo 8 de alta calidad.",
      precioDia: 15.27,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-8.webp",
      stockTotal: 6,
      tiendaId: 3,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Cascos Modelo 9",
      descripcion: "Cascos Modelo 9 de alta calidad.",
      precioDia: 47.19,
      estado: "activo",
      imagenUrl: "/uploads/productos/cascos-9.webp",
      stockTotal: 16,
      tiendaId: 3,
      categoriaId: 1,
      tallas: null,
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 1",
      descripcion: "Chaquetas Modelo 1 de alta calidad.",
      precioDia: 16.52,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-1.webp",
      stockTotal: 8,
      tiendaId: 9,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 2",
      descripcion: "Chaquetas Modelo 2 de alta calidad.",
      precioDia: 27.07,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-2.webp",
      stockTotal: 8,
      tiendaId: 5,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 3",
      descripcion: "Chaquetas Modelo 3 de alta calidad.",
      precioDia: 36.06,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-3.webp",
      stockTotal: 8,
      tiendaId: 3,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 4",
      descripcion: "Chaquetas Modelo 4 de alta calidad.",
      precioDia: 24.77,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-4.webp",
      stockTotal: 9,
      tiendaId: 2,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 5",
      descripcion: "Chaquetas Modelo 5 de alta calidad.",
      precioDia: 22.85,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-5.webp",
      stockTotal: 13,
      tiendaId: 2,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 6",
      descripcion: "Chaquetas Modelo 6 de alta calidad.",
      precioDia: 34.81,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-6.webp",
      stockTotal: 16,
      tiendaId: 4,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 7",
      descripcion: "Chaquetas Modelo 7 de alta calidad.",
      precioDia: 39.58,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-7.webp",
      stockTotal: 8,
      tiendaId: 7,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 8",
      descripcion: "Chaquetas Modelo 8 de alta calidad.",
      precioDia: 20.36,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-8.webp",
      stockTotal: 17,
      tiendaId: 4,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Chaquetas Modelo 9",
      descripcion: "Chaquetas Modelo 9 de alta calidad.",
      precioDia: 39.47,
      estado: "activo",
      imagenUrl: "/uploads/productos/chaquetas-9.webp",
      stockTotal: 17,
      tiendaId: 7,
      categoriaId: 2,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 1",
      descripcion: "Pantalones Modelo 1 de alta calidad.",
      precioDia: 43.35,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-1.webp",
      stockTotal: 5,
      tiendaId: 6,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 2",
      descripcion: "Pantalones Modelo 2 de alta calidad.",
      precioDia: 49.72,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-2.webp",
      stockTotal: 16,
      tiendaId: 6,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 3",
      descripcion: "Pantalones Modelo 3 de alta calidad.",
      precioDia: 20.68,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-3.webp",
      stockTotal: 9,
      tiendaId: 4,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 4",
      descripcion: "Pantalones Modelo 4 de alta calidad.",
      precioDia: 23.66,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-4.webp",
      stockTotal: 20,
      tiendaId: 9,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 5",
      descripcion: "Pantalones Modelo 5 de alta calidad.",
      precioDia: 46.86,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-5.webp",
      stockTotal: 3,
      tiendaId: 3,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 6",
      descripcion: "Pantalones Modelo 6 de alta calidad.",
      precioDia: 34.96,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-6.webp",
      stockTotal: 16,
      tiendaId: 5,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 7",
      descripcion: "Pantalones Modelo 7 de alta calidad.",
      precioDia: 25.82,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-7.webp",
      stockTotal: 2,
      tiendaId: 1,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 8",
      descripcion: "Pantalones Modelo 8 de alta calidad.",
      precioDia: 49.86,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-8.webp",
      stockTotal: 10,
      tiendaId: 4,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Pantalones Modelo 9",
      descripcion: "Pantalones Modelo 9 de alta calidad.",
      precioDia: 10.52,
      estado: "activo",
      imagenUrl: "/uploads/productos/pantalones-9.webp",
      stockTotal: 9,
      tiendaId: 3,
      categoriaId: 3,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 1",
      descripcion: "Botas Modelo 1 de alta calidad.",
      precioDia: 24.15,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-1.webp",
      stockTotal: 10,
      tiendaId: 1,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 2",
      descripcion: "Botas Modelo 2 de alta calidad.",
      precioDia: 19.53,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-2.webp",
      stockTotal: 4,
      tiendaId: 7,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 3",
      descripcion: "Botas Modelo 3 de alta calidad.",
      precioDia: 40.84,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-3.webp",
      stockTotal: 15,
      tiendaId: 8,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 4",
      descripcion: "Botas Modelo 4 de alta calidad.",
      precioDia: 10.88,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-4.webp",
      stockTotal: 3,
      tiendaId: 9,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 5",
      descripcion: "Botas Modelo 5 de alta calidad.",
      precioDia: 44.69,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-5.webp",
      stockTotal: 1,
      tiendaId: 4,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 6",
      descripcion: "Botas Modelo 6 de alta calidad.",
      precioDia: 38.5,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-6.webp",
      stockTotal: 3,
      tiendaId: 5,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 7",
      descripcion: "Botas Modelo 7 de alta calidad.",
      precioDia: 32.55,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-7.webp",
      stockTotal: 20,
      tiendaId: 2,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 8",
      descripcion: "Botas Modelo 8 de alta calidad.",
      precioDia: 46.22,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-8.webp",
      stockTotal: 14,
      tiendaId: 1,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Botas Modelo 9",
      descripcion: "Botas Modelo 9 de alta calidad.",
      precioDia: 11.17,
      estado: "activo",
      imagenUrl: "/uploads/productos/botas-9.webp",
      stockTotal: 15,
      tiendaId: 6,
      categoriaId: 4,
      tallas: ["S", "M", "L"],
      medidas: null
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 1",
      descripcion: "Snowboard Modelo 1 de alta calidad.",
      precioDia: 47.62,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-1.webp",
      stockTotal: 19,
      tiendaId: 5,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 151, "ancho": 31}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 2",
      descripcion: "Snowboard Modelo 2 de alta calidad.",
      precioDia: 43.09,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-2.webp",
      stockTotal: 4,
      tiendaId: 5,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 152, "ancho": 32}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 3",
      descripcion: "Snowboard Modelo 3 de alta calidad.",
      precioDia: 25.3,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-3.webp",
      stockTotal: 9,
      tiendaId: 4,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 153, "ancho": 33}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 4",
      descripcion: "Snowboard Modelo 4 de alta calidad.",
      precioDia: 15.29,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-4.webp",
      stockTotal: 10,
      tiendaId: 5,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 154, "ancho": 34}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 5",
      descripcion: "Snowboard Modelo 5 de alta calidad.",
      precioDia: 43.59,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-5.webp",
      stockTotal: 6,
      tiendaId: 2,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 155, "ancho": 35}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 6",
      descripcion: "Snowboard Modelo 6 de alta calidad.",
      precioDia: 18.08,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-6.webp",
      stockTotal: 14,
      tiendaId: 8,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 156, "ancho": 36}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 7",
      descripcion: "Snowboard Modelo 7 de alta calidad.",
      precioDia: 32.68,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-7.webp",
      stockTotal: 18,
      tiendaId: 9,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 157, "ancho": 37}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 8",
      descripcion: "Snowboard Modelo 8 de alta calidad.",
      precioDia: 32.12,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-8.webp",
      stockTotal: 13,
      tiendaId: 9,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 158, "ancho": 38}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Snowboard Modelo 9",
      descripcion: "Snowboard Modelo 9 de alta calidad.",
      precioDia: 17.79,
      estado: "activo",
      imagenUrl: "/uploads/productos/snowboard-9.webp",
      stockTotal: 17,
      tiendaId: 9,
      categoriaId: 5,
      tallas: null,
      medidas: {"largo": 159, "ancho": 39}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 1",
      descripcion: "Esquí Modelo 1 de alta calidad.",
      precioDia: 23.11,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-1.webp",
      stockTotal: 20,
      tiendaId: 7,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 151, "ancho": 31}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 2",
      descripcion: "Esquí Modelo 2 de alta calidad.",
      precioDia: 31.85,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-2.webp",
      stockTotal: 7,
      tiendaId: 9,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 152, "ancho": 32}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 3",
      descripcion: "Esquí Modelo 3 de alta calidad.",
      precioDia: 14.65,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-3.webp",
      stockTotal: 16,
      tiendaId: 2,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 153, "ancho": 33}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 4",
      descripcion: "Esquí Modelo 4 de alta calidad.",
      precioDia: 40.45,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-4.webp",
      stockTotal: 13,
      tiendaId: 3,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 154, "ancho": 34}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 5",
      descripcion: "Esquí Modelo 5 de alta calidad.",
      precioDia: 21.65,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-5.webp",
      stockTotal: 15,
      tiendaId: 3,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 155, "ancho": 35}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 6",
      descripcion: "Esquí Modelo 6 de alta calidad.",
      precioDia: 35.26,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-6.webp",
      stockTotal: 20,
      tiendaId: 2,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 156, "ancho": 36}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 7",
      descripcion: "Esquí Modelo 7 de alta calidad.",
      precioDia: 47.26,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-7.webp",
      stockTotal: 2,
      tiendaId: 6,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 157, "ancho": 37}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 8",
      descripcion: "Esquí Modelo 8 de alta calidad.",
      precioDia: 12.17,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-8.webp",
      stockTotal: 1,
      tiendaId: 9,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 158, "ancho": 38}
    }
  });

  await prisma.producto.create({
    data: {
      nombre: "Esquí Modelo 9",
      descripcion: "Esquí Modelo 9 de alta calidad.",
      precioDia: 41.09,
      estado: "activo",
      imagenUrl: "/uploads/productos/esquí-9.webp",
      stockTotal: 4,
      tiendaId: 9,
      categoriaId: 6,
      tallas: null,
      medidas: {"largo": 159, "ancho": 39}
    }
  });

  console.log("✅ Productos insertados correctamente.");
}

seedProductos()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });