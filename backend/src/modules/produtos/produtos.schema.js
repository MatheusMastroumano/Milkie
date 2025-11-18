import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const ProdutosSchema = z.object({
    nome: utils.nome,
    marca: z.string(),
    categoria: z.string(),
    descricao: z.string().max(50),
    sku: utils.string,
    fabricacao: z.coerce.date().nullable().optional(),
    validade: z.coerce.date().nullable().optional(),
    imagem_url: z.string().optional().nullable(),
    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
    fornecedores_ids: z.union([
        z.array(z.number()),
        z.null()
    ]).optional(),
});

export default ProdutosSchema;