import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';
import { Decimal } from "@prisma/client/runtime/library";

const VendasItensSchema = z.object({
    id: utils.id,
    venda_id: utils.id,
    produto_id: utils.id,
    quantidade: z.number().int().positive(),
    preco_unitario: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    subtotal: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
});

export default VendasItensSchema;