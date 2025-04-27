/*
  Warnings:

  - You are about to drop the column `fecha` on the `Clase` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Instructor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Instructor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descripcion` to the `Clase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivel` to the `Clase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Clase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Clase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `especialidad` to the `Instructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experiencia` to the `Instructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fotoUrl` to the `Instructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Instructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagenUrl` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockTotal` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metodoPago` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rolId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clase" DROP COLUMN "fecha",
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "nivel" TEXT NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "titulo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "nombre",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "especialidad" TEXT NOT NULL,
ADD COLUMN     "experiencia" INTEGER NOT NULL,
ADD COLUMN     "fotoUrl" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "imagenUrl" TEXT NOT NULL,
ADD COLUMN     "stockTotal" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "fechaReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "metodoPago" TEXT NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "estadoCuenta" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rolId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructorDisponibilidad" (
    "id" SERIAL NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "disponible" BOOLEAN NOT NULL,

    CONSTRAINT "InstructorDisponibilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoDisponibilidad" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cantidadDisponible" INTEGER NOT NULL,

    CONSTRAINT "ProductoDisponibilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL,
    "pdfUrl" TEXT NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "canal" TEXT NOT NULL DEFAULT 'email',

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valoracion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL DEFAULT 5,
    "comentario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claseId" INTEGER,
    "productoId" INTEGER,

    CONSTRAINT "Valoracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_reservaId_key" ON "Factura"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userId_key" ON "Instructor"("userId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorDisponibilidad" ADD CONSTRAINT "InstructorDisponibilidad_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoDisponibilidad" ADD CONSTRAINT "ProductoDisponibilidad_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Clase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
