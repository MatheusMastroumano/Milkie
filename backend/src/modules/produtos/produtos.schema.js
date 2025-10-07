import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const ProdutosSchema = z.object({
    id: utils.id,
    nome: utils.nome,
    marca: z.string(),
    categoria: z.string(),
    descricao: z.string().max(50),
    sku: utils.string,
    fabricacao: z.coerce.date(),
    validade: z.coerce.date(),
    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});

export default ProdutosSchema;