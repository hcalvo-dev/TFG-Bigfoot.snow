/*
  Warnings:

  - Added the required column `montanaId` to the `Tienda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tienda" ADD COLUMN     "montanaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Tienda" ADD CONSTRAINT "Tienda_montanaId_fkey" FOREIGN KEY ("montanaId") REFERENCES "Montaña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
