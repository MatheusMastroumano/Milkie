import { z } from 'zod'
import { id } from '../../shared/utils/verify.js';
import { Decimal } from "@prisma/client/runtime/library";

export const VendasItensSchema = z.object({

    id: id,
    venda_id: id,
    produto_id: id,
    quantidade: z.number().int().positive(),
    preco_unitario: z.union([ z.string(), z.number()]).transform((val) => new Decimal(val)),
    subtotal: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),

});