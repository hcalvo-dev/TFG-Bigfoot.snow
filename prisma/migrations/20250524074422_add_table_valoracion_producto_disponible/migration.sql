-- CreateTable
CREATE TABLE "ProductoDisponibilidad" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cantidadDisponible" INTEGER NOT NULL,

    CONSTRAINT "ProductoDisponibilidad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductoDisponibilidad" ADD CONSTRAINT "ProductoDisponibilidad_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
