/*
  Warnings:

  - Added the required column `cargo` to the `funcionarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `funcionarios` ADD COLUMN `cargo` VARCHAR(191) NOT NULL;
