/*
  Warnings:

  - You are about to drop the column `claseId` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the `Clase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductoDisponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipo` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Clase" DROP CONSTRAINT "Clase_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Clase" DROP CONSTRAINT "Clase_montanaId_fkey";

-- DropForeignKey
ALTER TABLE "ProductoDisponibilidad" DROP CONSTRAINT "ProductoDisponibilidad_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_claseId_fkey";

-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "claseId",
ADD COLUMN     "tipo" TEXT NOT NULL;

-- DropTable
DROP TABLE "Clase";

-- DropTable
DROP TABLE "ProductoDisponibilidad";
