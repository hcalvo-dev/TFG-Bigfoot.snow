/*
  Warnings:

  - You are about to drop the column `nivel` on the `Instructor` table. All the data in the column will be lost.
  - Added the required column `nivelId` to the `Instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "nivel",
ADD COLUMN     "nivelId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nivel_nombre_key" ON "Nivel"("nombre");

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
