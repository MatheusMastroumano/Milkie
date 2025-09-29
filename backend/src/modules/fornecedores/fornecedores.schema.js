import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';

export const Fornecedores = z.object({
    id: utils.id,
    nome: utils.nome,
    cnpj_cpf: z.string(),
    endereco: z.string(),
    ativo: z.boolean(),
    criado_em: utils.criadoEm,
});
