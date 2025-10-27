/*
  Warnings:

  - Added the required column `loja_id` to the `funcionarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `funcionarios` ADD COLUMN `loja_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `funcionarios` ADD CONSTRAINT `funcionarios_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
