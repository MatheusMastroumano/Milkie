import { z } from 'zod';
import { id, nome, criadoEm, string } from '../../shared/utils/verify.js';

export const ProdutosSchema = z.object({
    id: id,
    nome: nome,
    marca: z.string(),
    categoria: z.string(),
    descricao: z.string(),
    sku: string,
    fabricacao: z.coerce.date(),
    validade: z.coerce.date(),
    ativo: z.boolean.default(true),
    criado_em: criadoEm,
});
