/*
  Warnings:

  - Added the required column `testimonio` to the `Instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "testimonio" TEXT NOT NULL;
