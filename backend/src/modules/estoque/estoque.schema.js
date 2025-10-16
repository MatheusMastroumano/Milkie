import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

import pkg from '@prisma/client';
const { Decimal } = pkg;

const EstoqueSchema = z.object({
    produto_id: utils.id,
    loja_id: utils.id,
    quantidade: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
});

export default EstoqueSchema;