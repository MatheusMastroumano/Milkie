// isso vai ser importado em middlewares/moduleAccess.js

const MODULE_PERMISSIONS = {
    // tem que fazer depois nesse estilo (não necessariamnte assim, mas nesse estilo) pra todos os módulos: 
    // vou esperar o Gabriel passar os módulos que cada um pode acessar

    /*
        REALAÇÕES:

        matriz: auth, caixa, estoque, fornecedor_produtos, fornecedores, funcionarios, lojas, produtos, usuarios, venda_itens, venda_pagamentos, vendas

        filial: caixa, estoque, funcionarios, lojas, produtos, usuarios, venda_itens, venda_pagamentos, vendas

        pdv: caixa, estoque, lojas, venda_itens, venda_pagamentos, vendas
    */

    auth: ['admin'],
    caixa: ['admin', 'gerente', 'caixa'],
    estoque: ['admin', 'gerente', 'caixa'],
    fornecedor_produtos: ['admin'],
    fornecedores: ['admin'],
    funcionarios: ['admin', 'gerente'],
    lojas: ['admin', 'gerente', 'caixa'],
    produtos: ['admin', 'gerente'],
    usuarios: ['admin', 'gerente'],
    venda_itens: ['admin', 'gerente', 'caixa'],
    venda_pagamentos: ['admin', 'gerente', 'caixa'],
    vendas: ['admin', 'gerente', 'caixa'],
    financeiro: ['admin', 'gerente'],
};

export default MODULE_PERMISSIONS;