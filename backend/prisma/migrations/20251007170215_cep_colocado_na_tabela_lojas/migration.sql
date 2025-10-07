/*
  Warnings:

  - You are about to drop the column `bairro` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `complemento` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `fornecedores` table. All the data in the column will be lost.
  - Added the required column `complemento` to the `lojas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `lojas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fornecedores` DROP COLUMN `bairro`,
    DROP COLUMN `cep`,
    DROP COLUMN `cidade`,
    DROP COLUMN `complemento`,
    DROP COLUMN `estado`,
    DROP COLUMN `numero`,
    DROP COLUMN `rua`;

-- AlterTable
ALTER TABLE `lojas` ADD COLUMN `complemento` VARCHAR(191) NOT NULL,
    ADD COLUMN `numero` VARCHAR(191) NOT NULL;
