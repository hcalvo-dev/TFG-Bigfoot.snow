/*
  Warnings:

  - You are about to drop the `Factura` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "tokenCarrito" TEXT,
ALTER COLUMN "usuarioId" DROP NOT NULL,
ALTER COLUMN "expiresAt" DROP NOT NULL;

-- DropTable
DROP TABLE "Factura";

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
