import { z } from 'zod';
import { id, nome, string } from '../../shared/utils/verify.js';

export const UsuariosSchema = z.object({
    id: id,
    funcionario_id: id,
    loja_id: id.optional(),
    funcao: FuncaoEnum.default('caixa'),
    username: nome,
    senha_hash: string,
    ativo: z.boolean().default(true)
});

const FuncaoEnum = z.enum(['admin', 'gerente', 'caixa']);
