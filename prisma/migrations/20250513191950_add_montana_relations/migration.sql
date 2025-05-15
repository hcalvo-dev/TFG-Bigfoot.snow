/*
  Warnings:

  - Added the required column `montanaId` to the `Clase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montanaId` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clase" ADD COLUMN     "montanaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "montanaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Clase" ADD CONSTRAINT "Clase_montanaId_fkey" FOREIGN KEY ("montanaId") REFERENCES "Montaña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_montanaId_fkey" FOREIGN KEY ("montanaId") REFERENCES "Montaña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
