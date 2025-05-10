-- CreateTable
CREATE TABLE "Montaña" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "altura" INTEGER NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Montaña_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "dificultad" TEXT NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "montañaId" INTEGER NOT NULL,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InstructorMontaña" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_InstructorMontaña_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InstructorMontaña_B_index" ON "_InstructorMontaña"("B");

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_montañaId_fkey" FOREIGN KEY ("montañaId") REFERENCES "Montaña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorMontaña" ADD CONSTRAINT "_InstructorMontaña_A_fkey" FOREIGN KEY ("A") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorMontaña" ADD CONSTRAINT "_InstructorMontaña_B_fkey" FOREIGN KEY ("B") REFERENCES "Montaña"("id") ON DELETE CASCADE ON UPDATE CASCADE;
