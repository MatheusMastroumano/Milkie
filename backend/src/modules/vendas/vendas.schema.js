import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';
import { Decimal } from "@prisma/client/runtime/library";

export const VendasSchema = z.object({
    id: utils.id,
    loja_id: z.number().int().positive(),
    usuario_id: z.number().int().positive(),
    comprador_cpf: z.number().int().positive(),
    valor_total: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    data: z.coerce().date(),
});
