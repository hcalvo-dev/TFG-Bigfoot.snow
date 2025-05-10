/*
  Warnings:

  - You are about to drop the column `experiencia` on the `Instructor` table. All the data in the column will be lost.
  - Added the required column `nivel` to the `Instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "experiencia",
ADD COLUMN     "nivel" TEXT NOT NULL;
