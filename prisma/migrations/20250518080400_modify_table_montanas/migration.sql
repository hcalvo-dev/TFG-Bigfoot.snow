/*
  Warnings:

  - Added the required column `lat` to the `Montaña` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `Montaña` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Montaña" ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lon" DOUBLE PRECISION NOT NULL;
