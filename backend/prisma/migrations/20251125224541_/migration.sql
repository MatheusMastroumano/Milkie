-- CreateTable
CREATE TABLE `despesas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loja_id` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `status` ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamentos_fornecedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fornecedor_id` INTEGER NOT NULL,
    `loja_id` INTEGER NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `vencimento` DATETIME(3) NOT NULL,
    `data_pagamento` DATETIME(3) NULL,
    `status` ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamentos_funcionarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `funcionario_id` INTEGER NOT NULL,
    `loja_id` INTEGER NOT NULL,
    `salario` DECIMAL(10, 2) NOT NULL,
    `comissao` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `data_pagamento` DATETIME(3) NULL,
    `status` ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `despesas` ADD CONSTRAINT `despesas_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos_fornecedores` ADD CONSTRAINT `pagamentos_fornecedores_fornecedor_id_fkey` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos_fornecedores` ADD CONSTRAINT `pagamentos_fornecedores_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos_funcionarios` ADD CONSTRAINT `pagamentos_funcionarios_funcionario_id_fkey` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos_funcionarios` ADD CONSTRAINT `pagamentos_funcionarios_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
