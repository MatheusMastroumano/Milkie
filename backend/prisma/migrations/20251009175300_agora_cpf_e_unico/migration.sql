/*
  Warnings:

  - A unique constraint covering the columns `[cnpj_cpf]` on the table `fornecedores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `fornecedores_cnpj_cpf_key` ON `fornecedores`(`cnpj_cpf`);
