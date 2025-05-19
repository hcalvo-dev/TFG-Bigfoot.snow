/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `claseId` on the `Valoracion` table. All the data in the column will be lost.
  - You are about to drop the `Notificacion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tiendaId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacion` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notificacion" DROP CONSTRAINT "Notificacion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Valoracion" DROP CONSTRAINT "Valoracion_claseId_fkey";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "categoriaId",
ADD COLUMN     "medidas" TEXT[],
ADD COLUMN     "tallas" TEXT[],
ADD COLUMN     "tiendaId" INTEGER NOT NULL,
ADD COLUMN     "ubicacion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Valoracion" DROP COLUMN "claseId";

-- DropTable
DROP TABLE "Notificacion";

-- CreateTable
CREATE TABLE "Tienda" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductoCategorias" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductoCategorias_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tienda_nombre_key" ON "Tienda"("nombre");

-- CreateIndex
CREATE INDEX "_ProductoCategorias_B_index" ON "_ProductoCategorias"("B");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "Tienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoCategorias" ADD CONSTRAINT "_ProductoCategorias_A_fkey" FOREIGN KEY ("A") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoCategorias" ADD CONSTRAINT "_ProductoCategorias_B_fkey" FOREIGN KEY ("B") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
