import { z } from 'zod';
import { id, nome, criadoEm } from '../../shared/utils/verify.js';

export const FuncionariosSchema = z.object({
    id: id,
    nome: nome,
    cpf: z.string().optional(),
    email: z.string().optional(),
    telefone: z.string().optional(),
    idade: z.number().int().positive(),
    salario: z.number().optional,
    ativo: z.boolean().default(() => true),
    criado_em: criadoEm,
});
