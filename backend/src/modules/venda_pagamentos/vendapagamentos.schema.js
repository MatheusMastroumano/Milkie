import { z } from 'zod'
import { id } from '../../shared/utils/verify.js'
import {Decimal} from '@prisma/client/runtime/library'

export const VendasPagamentosSchema = z.object({
    
    id: id,
    vneda_id: id,
    metodo: metodoPagamento,  
    valor: z.union([ z.string(), z.number()]).transform((val) => new Decimal(val)),

})

const metodoPagamento = z.enum(["dinheiro", "cartaodebito", "cartaocredito", "pix"])