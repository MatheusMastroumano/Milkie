import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

import pkg from '@prisma/client';
const { Decimal } = pkg;

const FuncionariosSchema = z.object({
    nome: utils.nome,
    cpf: z.string(),
    email: z.string().email(),
    telefone: z.string(),
    idade: z.number().int().positive().min(18, 'a idade mínima é de 18 anos').max(70, 'a idade máxima é de 70 anos'),
    cargo: utils.string,
    salario: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});

export default FuncionariosSchema;