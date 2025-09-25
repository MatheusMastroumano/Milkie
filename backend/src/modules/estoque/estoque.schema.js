import { z } from 'zod';
import { id } from '../../shared/utils/verify.js';

export const EstoqueSchema = z.object({
    produto_id: id,
    loja_id: id,
    quantidade: z.number().positive(),
});
