import { z } from 'zod';
import { id, string } from '../../shared/utils/verify.js';

export const ProdutosSchema = z.object({
    id: id,
    produto_id: id,
    loja_id: id,
    preco: z.number().positive(),
    valido_de: z.coerce.date(),
    valido_ate: z.coerce.date(),
});
