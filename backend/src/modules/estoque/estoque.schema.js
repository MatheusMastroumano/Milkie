import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const EstoqueSchema = z.object({
    produto_id: utils.id,
    loja_id: utils.id,
    quantidade: z.number().positive(),
});

export default EstoqueSchema;