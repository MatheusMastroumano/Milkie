/*
  Warnings:

  - Made the column `cpf` on table `funcionarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `funcionarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone` on table `funcionarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idade` on table `funcionarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salario` on table `funcionarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `marca` on table `produtos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoria` on table `produtos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descricao` on table `produtos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sku` on table `produtos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fabricacao` on table `produtos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `validade` on table `produtos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `funcionarios` MODIFY `cpf` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `telefone` VARCHAR(191) NOT NULL,
    MODIFY `idade` INTEGER NOT NULL,
    MODIFY `salario` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `produtos` MODIFY `marca` VARCHAR(191) NOT NULL,
    MODIFY `categoria` VARCHAR(191) NOT NULL,
    MODIFY `descricao` VARCHAR(191) NOT NULL,
    MODIFY `sku` VARCHAR(191) NOT NULL,
    MODIFY `fabricacao` DATETIME(3) NOT NULL,
    MODIFY `validade` DATETIME(3) NOT NULL;
