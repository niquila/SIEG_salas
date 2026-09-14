/*
  Warnings:

  - You are about to drop the column `turno` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `preco_locacao` on the `salas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_sala,dia,horaInicio]` on the table `reservas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `horaFim` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reservas_id_sala_dia_turno_key";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "turno",
ADD COLUMN     "horaFim" TEXT NOT NULL,
ADD COLUMN     "horaInicio" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "salas" DROP COLUMN "preco_locacao";

-- CreateIndex
CREATE UNIQUE INDEX "reservas_id_sala_dia_horaInicio_key" ON "reservas"("id_sala", "dia", "horaInicio");
