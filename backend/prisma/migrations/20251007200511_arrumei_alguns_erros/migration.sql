/*
  Warnings:

  - Added the required column `produtos_fornecidos` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Made the column `cnpj_cpf` on table `fornecedores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `fornecedores` ADD COLUMN `produtos_fornecidos` VARCHAR(191) NOT NULL,
    MODIFY `cnpj_cpf` VARCHAR(191) NOT NULL;
