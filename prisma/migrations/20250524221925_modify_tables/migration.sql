/*
  Warnings:

  - You are about to drop the column `tipo` on the `Reserva` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "tipo",
ADD COLUMN     "claseId" INTEGER;

-- CreateTable
CREATE TABLE "Clase" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "montanaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clase" ADD CONSTRAINT "Clase_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clase" ADD CONSTRAINT "Clase_montanaId_fkey" FOREIGN KEY ("montanaId") REFERENCES "Montaña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Clase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
