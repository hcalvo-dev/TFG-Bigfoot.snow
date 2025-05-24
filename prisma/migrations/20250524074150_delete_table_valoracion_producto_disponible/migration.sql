/*
  Warnings:

  - You are about to drop the `ProductoDisponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Valoracion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductoDisponibilidad" DROP CONSTRAINT "ProductoDisponibilidad_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Valoracion" DROP CONSTRAINT "Valoracion_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Valoracion" DROP CONSTRAINT "Valoracion_usuarioId_fkey";

-- DropTable
DROP TABLE "ProductoDisponibilidad";

-- DropTable
DROP TABLE "Valoracion";
