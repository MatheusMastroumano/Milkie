import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';
import { Decimal } from "@prisma/client/runtime/library";

const StatusCaixa = z.enum(["aberto", "fechado"]);

const CaixaSchema = z.object({
    id: utils.id,
    loja_id: z.number().int().positive(),
    aberto_por: z.coerce().date(),
    aberto_em: z.coerce().date(),
    fechado_por: z.number().int().positive(),
    fechado_em: z.coerce().date(),
    valor_inicial: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    valor_final: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    status: StatusCaixa.default("aberto")
});

export default CaixaSchema;