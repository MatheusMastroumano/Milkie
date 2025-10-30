/*
  Warnings:

  - You are about to alter the column `quantidade` on the `estoque` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to drop the `precos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `preco` to the `estoque` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `precos` DROP FOREIGN KEY `precos_loja_id_fkey`;

-- DropForeignKey
ALTER TABLE `precos` DROP FOREIGN KEY `precos_produto_id_fkey`;

-- AlterTable
ALTER TABLE `estoque` ADD COLUMN `preco` INTEGER NOT NULL,
    MODIFY `quantidade` INTEGER NOT NULL;

-- DropTable
DROP TABLE `precos`;
