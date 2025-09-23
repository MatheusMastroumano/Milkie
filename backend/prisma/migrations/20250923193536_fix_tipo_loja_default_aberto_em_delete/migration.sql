/*
  Warnings:

  - You are about to drop the column `aberta_em` on the `lojas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lojas` DROP COLUMN `aberta_em`,
    MODIFY `tipo` ENUM('matriz', 'filial') NOT NULL DEFAULT 'filial';
