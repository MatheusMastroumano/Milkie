import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getProdutos() {
    try {
        const produtos = await prisma.produtos.findMany();
        
        // Buscar fornecedores para cada produto baseado nos IDs
        const produtosComFornecedores = await Promise.all(
            produtos.map(async (produto) => {
                if (produto.fornecedores_ids && Array.isArray(produto.fornecedores_ids)) {
                    const fornecedores = await prisma.fornecedores.findMany({
                        where: {
                            id: { in: produto.fornecedores_ids }
                        }
                    });
                    return {
                        ...produto,
                        fornecedores: fornecedores.map(f => ({
                            fornecedor: f,
                            fornecedor_id: f.id
                        }))
                    };
                }
                return {
                    ...produto,
                    fornecedores: []
                };
            })
        );
        
        return produtosComFornecedores;
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getProdutosById(id) {
    try {
        const produto = await prisma.produtos.findUnique({
            where: { id: Number(id) },
            include: {
                estoque: {
                    include: {
                        loja: {
                            select: {
                                id: true,
                                nome: true,
                                tipo: true,
                            }
                        }
                    }
                }
            }
        });

        if (!produto) return null;

        // Buscar fornecedores baseado nos IDs
        if (produto.fornecedores_ids && Array.isArray(produto.fornecedores_ids)) {
            const fornecedores = await prisma.fornecedores.findMany({
                where: {
                    id: { in: produto.fornecedores_ids }
                }
            });
            produto.fornecedores = fornecedores.map(f => ({
                fornecedor: f,
                fornecedor_id: f.id
            }));
        } else {
            produto.fornecedores = [];
        }

        return produto;
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createProdutos(data) {
    const { nome, marca, categoria, descricao, sku, fabricacao, validade, ativo, imagem_url, fornecedores_ids } = data;

    // Validar datas apenas se forem fornecidas
    if (fabricacao && validade) {
        const dataFabricacao = new Date(fabricacao);
        const dataValidade = new Date(validade);
        
        if (dataFabricacao > dataValidade) {
            throw new Error('Data de fabricação inválida.');
        }

        // Remover validação de validade no passado, pois pode ser para produtos futuros
        // if (dataValidade < new Date()) {
        //     throw new Error('Data de validade inválida.');
        // }
    }

    if (ativo !== true && ativo !== false) {
        throw new Error('Ativo inválido.');
    }

    // Validar se SKU já existe no banco de dados
    if (sku) {
        const produtoExistente = await prisma.produtos.findUnique({
            where: { sku: sku },
        });

        if (produtoExistente) {
            throw new Error('Já existe um produto cadastrado com este SKU.');
        }
    }

    try {
        // Processar fornecedores_ids - converter para array de números
        let fornecedoresArray = [];
        
        console.log('Service - Fornecedores IDs recebidos:', fornecedores_ids);
        console.log('Service - Tipo:', typeof fornecedores_ids);
        console.log('Service - É array?', Array.isArray(fornecedores_ids));
        
        if (fornecedores_ids !== undefined && fornecedores_ids !== null) {
            if (Array.isArray(fornecedores_ids)) {
                fornecedoresArray = fornecedores_ids
                    .map(id => {
                        const numId = Number(id);
                        return isNaN(numId) ? null : numId;
                    })
                    .filter(id => id !== null && id > 0);
            } else if (typeof fornecedores_ids === 'string' && fornecedores_ids.trim()) {
                fornecedoresArray = fornecedores_ids
                    .split(',')
                    .map(id => {
                        const numId = Number(id.trim());
                        return isNaN(numId) ? null : numId;
                    })
                    .filter(id => id !== null && id > 0);
            }
        }

        console.log('Service - Fornecedores IDs processados:', fornecedoresArray);

        const produtoData = {
            nome,
            marca,
            categoria,
            descricao,
            sku,
            fabricacao,
            validade,
            ativo,
            imagem_url
        };

        // Adicionar fornecedores_ids apenas se houver valores válidos
        if (fornecedoresArray.length > 0) {
            produtoData.fornecedores_ids = fornecedoresArray;
        } else {
            // Se não houver fornecedores, definir como null explicitamente
            produtoData.fornecedores_ids = null;
        }

        console.log('Service - ProdutoData antes de criar:', JSON.stringify(produtoData, null, 2));
        console.log('Service - Tipo de fornecedores_ids:', typeof produtoData.fornecedores_ids);
        console.log('Service - É array?', Array.isArray(produtoData.fornecedores_ids));

        const produtoCriado = await prisma.produtos.create({
            data: produtoData
        });

        console.log('Service - Produto criado:', JSON.stringify(produtoCriado, null, 2));

        return produtoCriado;
    } catch (err) {
        console.error('Erro ao criar produto: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateProdutos(id, data) {
    const { nome, marca, categoria, descricao, sku, fabricacao, validade, ativo, imagem_url, fornecedores_ids } = data;

    if (ativo !== true && ativo !== false) {
        throw new Error('Ativo inválido.');
    }

    try {
        // Processar fornecedores_ids se fornecido
        let fornecedoresArray = null;
        if (fornecedores_ids !== undefined) {
            if (Array.isArray(fornecedores_ids)) {
                fornecedoresArray = fornecedores_ids
                    .map(id => Number(id))
                    .filter(id => !isNaN(id) && id > 0);
            } else if (typeof fornecedores_ids === 'string' && fornecedores_ids.trim()) {
                fornecedoresArray = fornecedores_ids
                    .split(',')
                    .map(id => Number(id.trim()))
                    .filter(id => !isNaN(id) && id > 0);
            }
            
            // Se o array estiver vazio, definir como null
            if (fornecedoresArray && fornecedoresArray.length === 0) {
                fornecedoresArray = null;
            }
        }

        const produtoData = {
            nome,
            marca,
            categoria,
            descricao,
            sku,
            fabricacao,
            validade,
            ativo,
            imagem_url
        };

        // Adicionar fornecedores_ids apenas se foi fornecido
        if (fornecedores_ids !== undefined) {
            produtoData.fornecedores_ids = fornecedoresArray;
        }

        return await prisma.produtos.update({
            where: { id: Number(id) },
            data: produtoData
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeProdutos(id) {
    try {
        return await prisma.produtos.delete({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}