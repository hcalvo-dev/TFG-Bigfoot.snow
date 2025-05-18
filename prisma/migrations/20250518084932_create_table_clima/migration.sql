-- CreateTable
CREATE TABLE "Clima" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "temperaturaMax" DOUBLE PRECISION NOT NULL,
    "temperaturaMin" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT NOT NULL,
    "icono" TEXT NOT NULL,
    "montañaId" INTEGER NOT NULL,

    CONSTRAINT "Clima_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clima_fecha_montañaId_key" ON "Clima"("fecha", "montañaId");

-- AddForeignKey
ALTER TABLE "Clima" ADD CONSTRAINT "Clima_montañaId_fkey" FOREIGN KEY ("montañaId") REFERENCES "Montaña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
