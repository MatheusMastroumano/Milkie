/*
  Warnings:

  - You are about to drop the column `endereco` on the `fornecedores` table. All the data in the column will be lost.
  - Added the required column `bairro` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `fornecedores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fornecedores` DROP COLUMN `endereco`,
    ADD COLUMN `bairro` VARCHAR(191) NOT NULL,
    ADD COLUMN `cep` VARCHAR(191) NOT NULL,
    ADD COLUMN `cidade` VARCHAR(191) NOT NULL,
    ADD COLUMN `complemento` VARCHAR(191) NULL,
    ADD COLUMN `estado` VARCHAR(191) NOT NULL,
    ADD COLUMN `numero` VARCHAR(191) NOT NULL,
    ADD COLUMN `rua` VARCHAR(191) NOT NULL;
