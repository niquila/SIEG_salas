/*
  Warnings:

  - Added the required column `andar` to the `salas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "salas" 
ADD COLUMN     "andar" TEXT,
ADD COLUMN     "unidade" TEXT;
