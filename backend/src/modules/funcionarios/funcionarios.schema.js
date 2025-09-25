import { z } from 'zod';
import { id, nome, criadoEm, } from '../../shared/utils/verify.js';

export const FuncionariosSchema = z.object({
    id: id,
    nome: nome,
    cpf: z.string(),
    email: z.string().email(),
    telefone: z.string(),
    idade: z.number().int().positive(),
    salario: z.number().positive(),
    ativo: z.boolean().default(true),
    criado_em: criadoEm,
});
