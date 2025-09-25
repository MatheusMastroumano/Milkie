import { z } from 'zod'
import { id } from '../../shared/utils/verify.js';
import { Decimal } from "@prisma/client/runtime/library";

export const VendasSchema = z.object({

    id: id,
    loja_id: z.number().int().positive(),
    aberto_por: z.coerce().date(),
    aberto_em: z.coerce().date(),
    fechado_por: z.number().int().positive(),
    fechado_em: z.coerce().dete(),
    valor_inicial: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    valor_final: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    status: StatusCaixa.default("aberto")
    
})


const StatusCaixa = z.enum(["aberto", "fechado"])
