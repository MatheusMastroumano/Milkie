import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const PrecosSchema = z.object({
    produto_id: utils.id,
    loja_id: utils.id,
    preco: z.number().positive(),
    valido_de: z.coerce.date(),
    valido_ate: z.coerce.date(),
});

export default PrecosSchema;