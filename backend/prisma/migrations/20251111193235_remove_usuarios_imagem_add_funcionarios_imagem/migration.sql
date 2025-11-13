/*
  Warnings:

  - You are about to drop the column `imagem` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `funcionarios` ADD COLUMN `imagem` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `imagem`;
