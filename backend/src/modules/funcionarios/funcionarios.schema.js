import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

export const FuncionariosSchema = z.object({
    id: utils.id,
    nome: utils.nome,
    cpf: z.string(),
    email: z.string().email(),
    telefone: z.string(),
    idade: z.number().int().positive(),
    cargo: utils.string,
    salario: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});
