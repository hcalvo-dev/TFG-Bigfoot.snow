/*
  Warnings:

  - Added the required column `expiresAt` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pagado" BOOLEAN NOT NULL DEFAULT false;
