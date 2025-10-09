/*
  Warnings:

  - A unique constraint covering the columns `[CEP]` on the table `lojas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `lojas_CEP_key` ON `lojas`(`CEP`);
