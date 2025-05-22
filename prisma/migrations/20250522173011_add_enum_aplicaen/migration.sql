/*
  Warnings:

  - Changed the type of `aplicaEn` on the `Descuento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AplicaEn" AS ENUM ('PRODUCTOS', 'CLASES', 'AMBOS');

-- AlterTable
ALTER TABLE "Descuento" DROP COLUMN "aplicaEn",
ADD COLUMN     "aplicaEn" "AplicaEn" NOT NULL;
