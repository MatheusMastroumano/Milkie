/*
  Warnings:

  - You are about to drop the column `endereco` on the `lojas` table. All the data in the column will be lost.
  - Added the required column `CEP` to the `lojas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lojas` DROP COLUMN `endereco`,
    ADD COLUMN `CEP` VARCHAR(191) NOT NULL;
