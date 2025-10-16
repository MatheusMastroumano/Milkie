import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';
import { Decimal } from '@prisma/client/runtime/library';

const metodoPagamento = z.enum(["dinheiro", "cartaodebito", "cartaocredito", "pix"]);

const VendasPagamentosSchema = z.object({
    venda_id: utils.id,
    metodo: metodoPagamento,
    valor: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
});

export default VendasPagamentosSchema;