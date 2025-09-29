import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

export const UsuariosSchema = z.object({
    id: utils.id,
    funcionario_id: utils.id,
    loja_id: utils.id,
    funcao: FuncaoEnum.default('caixa'),
    username: utils.nome,
    senha_hash: utils.string,
    ativo: z.boolean().default(true)
});

const FuncaoEnum = z.enum(['admin', 'gerente', 'caixa']);
