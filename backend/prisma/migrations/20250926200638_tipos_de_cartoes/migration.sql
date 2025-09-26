/*
  Warnings:

  - The values [cartao] on the enum `venda_pagamentos_metodo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `venda_pagamentos` MODIFY `metodo` ENUM('dinheiro', 'cartaocredito', 'cartaodebito', 'pix') NOT NULL;
