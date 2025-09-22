-- CreateTable
CREATE TABLE `lojas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` ENUM('matriz', 'filial') NOT NULL,
    `endereco` VARCHAR(191) NULL,
    `aberta_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `funcionarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `idade` INTEGER NULL,
    `salario` DECIMAL(10, 2) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `funcionarios_cpf_key`(`cpf`),
    UNIQUE INDEX `funcionarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `funcionario_id` INTEGER NOT NULL,
    `loja_id` INTEGER NULL,
    `funcao` ENUM('admin', 'gerente', 'caixa') NOT NULL DEFAULT 'caixa',
    `username` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `usuarios_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NULL,
    `descricao` VARCHAR(191) NULL,
    `sku` VARCHAR(191) NULL,
    `fabricacao` DATETIME(3) NULL,
    `validade` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `produtos_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `precos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produto_id` INTEGER NOT NULL,
    `loja_id` INTEGER NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `valido_de` DATETIME(3) NOT NULL,
    `valido_ate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estoque` (
    `produto_id` INTEGER NOT NULL,
    `loja_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`produto_id`, `loja_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fornecedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj_cpf` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fornecedor_produtos` (
    `fornecedor_id` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,

    PRIMARY KEY (`fornecedor_id`, `produto_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loja_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `comprador_cpf` VARCHAR(191) NULL,
    `valor_total` DECIMAL(10, 2) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venda_itens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `venda_id` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 2) NOT NULL,
    `preco_unitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venda_pagamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `venda_id` INTEGER NOT NULL,
    `metodo` ENUM('dinheiro', 'cartao', 'pix') NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `caixa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loja_id` INTEGER NOT NULL,
    `aberto_por` INTEGER NOT NULL,
    `aberto_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechado_por` INTEGER NULL,
    `fechado_em` DATETIME(3) NULL,
    `valor_inicial` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `valor_final` DECIMAL(65, 30) NULL,
    `status` ENUM('aberto', 'fechado') NOT NULL DEFAULT 'aberto',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_funcionario_id_fkey` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `precos` ADD CONSTRAINT `precos_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `precos` ADD CONSTRAINT `precos_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque` ADD CONSTRAINT `estoque_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque` ADD CONSTRAINT `estoque_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fornecedor_produtos` ADD CONSTRAINT `fornecedor_produtos_fornecedor_id_fkey` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fornecedor_produtos` ADD CONSTRAINT `fornecedor_produtos_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendas` ADD CONSTRAINT `vendas_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendas` ADD CONSTRAINT `vendas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venda_itens` ADD CONSTRAINT `venda_itens_venda_id_fkey` FOREIGN KEY (`venda_id`) REFERENCES `vendas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venda_itens` ADD CONSTRAINT `venda_itens_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venda_pagamentos` ADD CONSTRAINT `venda_pagamentos_venda_id_fkey` FOREIGN KEY (`venda_id`) REFERENCES `vendas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caixa` ADD CONSTRAINT `caixa_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `lojas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caixa` ADD CONSTRAINT `caixa_aberto_por_fkey` FOREIGN KEY (`aberto_por`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caixa` ADD CONSTRAINT `caixa_fechado_por_fkey` FOREIGN KEY (`fechado_por`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
